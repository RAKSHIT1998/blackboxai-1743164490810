const { query, run } = require('../config/db');
const logger = require('../config/logger');

const betController = {
  // Place a new bet
  placeBet: async (req, res) => {
    try {
      const userId = req.user.id;
      const { gameType, betAmount, odds, selection } = req.body;

      // Validate input
      if (!gameType || !betAmount || !odds || !selection) {
        return res.status(400).json({
          success: false,
          message: 'All bet details are required'
        });
      }

      // Get user's current balance
      const users = await query(
        'SELECT balance FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const currentBalance = users[0].balance;

      // Check if user has sufficient balance
      if (currentBalance < betAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Start transaction
      await run('BEGIN TRANSACTION');

      try {
        // Deduct bet amount from user's balance
        await run(
          'UPDATE users SET balance = balance - ? WHERE id = ?',
          [betAmount, userId]
        );

        // Create bet record
        const result = await run(
          `INSERT INTO bets (
            user_id, game_type, bet_amount, odds, status, selection
          ) VALUES (?, ?, ?, ?, 'pending', ?)`,
          [userId, gameType, betAmount, odds, selection]
        );

        // Commit transaction
        await run('COMMIT');

        logger.betLog(`New bet placed: ${gameType} - $${betAmount}`, userId, result.id);

        // Emit real-time update via WebSocket
        const io = req.app.get('io');
        io.to(`user-${userId}`).emit('bet-placed', {
          betId: result.id,
          gameType,
          betAmount,
          odds,
          selection
        });

        res.json({
          success: true,
          message: 'Bet placed successfully',
          bet: {
            id: result.id,
            gameType,
            betAmount,
            odds,
            selection,
            status: 'pending'
          }
        });
      } catch (error) {
        // Rollback transaction on error
        await run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      logger.error('Place bet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to place bet'
      });
    }
  },

  // Get bet details
  getBet: async (req, res) => {
    try {
      const { betId } = req.params;
      const userId = req.user.id;

      const bets = await query(
        `SELECT id, game_type, bet_amount, odds, status, selection, result, winnings, created_at 
         FROM bets 
         WHERE id = ? AND user_id = ?`,
        [betId, userId]
      );

      if (bets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bet not found'
        });
      }

      res.json({
        success: true,
        bet: bets[0]
      });
    } catch (error) {
      logger.error('Get bet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bet details'
      });
    }
  },

  // Process bet result
  processBetResult: async (req, res) => {
    try {
      const { betId } = req.params;
      const { result, winnings } = req.body;

      // Start transaction
      await run('BEGIN TRANSACTION');

      try {
        // Update bet status and result
        const updateResult = await run(
          `UPDATE bets 
           SET status = ?, result = ?, winnings = ? 
           WHERE id = ?`,
          [winnings > 0 ? 'won' : 'lost', result, winnings, betId]
        );

        if (updateResult.changes === 0) {
          throw new Error('Bet not found');
        }

        // If bet is won, add winnings to user's balance
        if (winnings > 0) {
          const bets = await query(
            'SELECT user_id FROM bets WHERE id = ?',
            [betId]
          );

          await run(
            'UPDATE users SET balance = balance + ? WHERE id = ?',
            [winnings, bets[0].user_id]
          );

          // Emit real-time update via WebSocket
          const io = req.app.get('io');
          io.to(`user-${bets[0].user_id}`).emit('bet-result', {
            betId,
            result,
            winnings
          });
        }

        // Commit transaction
        await run('COMMIT');

        logger.betLog(`Bet ${betId} processed: ${result}`, null, betId);

        res.json({
          success: true,
          message: 'Bet processed successfully'
        });
      } catch (error) {
        // Rollback transaction on error
        await run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      logger.error('Process bet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process bet'
      });
    }
  },

  // Get live odds
  getLiveOdds: async (req, res) => {
    try {
      const { gameType } = req.query;

      // Mock live odds data - in production, this would come from external APIs
      const mockOdds = {
        sports: [
          {
            eventId: 1,
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            odds: {
              home: 2.1,
              draw: 3.4,
              away: 3.2
            }
          }
        ],
        casino: [
          {
            gameId: 1,
            name: 'Blackjack',
            odds: 1.95
          }
        ],
        'mini-games': [
          {
            gameId: 1,
            name: 'Aviator',
            currentMultiplier: 1.5
          }
        ]
      };

      res.json({
        success: true,
        odds: mockOdds[gameType] || []
      });
    } catch (error) {
      logger.error('Get live odds error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch live odds'
      });
    }
  },

  // Get betting statistics
  getBetStats: async (req, res) => {
    try {
      const userId = req.user.id;

      const stats = await query(
        `SELECT 
          COUNT(*) as totalBets,
          SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as wonBets,
          SUM(bet_amount) as totalBetAmount,
          SUM(CASE WHEN status = 'won' THEN winnings ELSE 0 END) as totalWinnings
         FROM bets 
         WHERE user_id = ?`,
        [userId]
      );

      res.json({
        success: true,
        stats: {
          totalBets: stats[0].totalBets,
          wonBets: stats[0].wonBets,
          winRate: stats[0].totalBets > 0 
            ? (stats[0].wonBets / stats[0].totalBets * 100).toFixed(2)
            : 0,
          totalBetAmount: stats[0].totalBetAmount || 0,
          totalWinnings: stats[0].totalWinnings || 0,
          profitLoss: (stats[0].totalWinnings || 0) - (stats[0].totalBetAmount || 0)
        }
      });
    } catch (error) {
      logger.error('Get bet stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch betting statistics'
      });
    }
  }
};

module.exports = betController;