const { query, run } = require('../config/db');
const logger = require('../config/logger');
const axios = require('axios');

// Mock API endpoints - replace with actual provider endpoints
const PROVIDERS = {
  spribe: {
    baseUrl: process.env.SPRIBE_API_URL,
    key: process.env.SPRIBE_API_KEY
  },
  hacksaw: {
    baseUrl: process.env.HACKSAW_API_URL,
    key: process.env.HACKSAW_API_KEY
  }
};

const miniGamesController = {
  // Get available mini games
  getGames: async (req, res) => {
    try {
      const { provider } = req.query;
      
      // Get games from provider's API
      const games = await fetchGamesFromProvider(provider);
      
      res.json({
        success: true,
        games
      });
    } catch (error) {
      logger.error('Get mini games error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch mini games'
      });
    }
  },

  // Start Aviator game session
  startAviator: async (req, res) => {
    try {
      const userId = req.user.id;
      const { betAmount } = req.body;

      // Validate bet amount
      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid bet amount is required'
        });
      }

      // Get user's balance
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

      if (users[0].balance < betAmount) {
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

        // Create game session
        const result = await run(
          `INSERT INTO minigame_sessions (
            user_id, game_type, bet_amount, status
          ) VALUES (?, 'aviator', ?, 'active')`,
          [userId, betAmount]
        );

        // Generate crash point (mock implementation)
        const crashPoint = generateCrashPoint();

        // Store crash point
        await run(
          'UPDATE minigame_sessions SET crash_point = ? WHERE id = ?',
          [crashPoint, result.id]
        );

        // Commit transaction
        await run('COMMIT');

        // Start sending multiplier updates via WebSocket
        const io = req.app.get('io');
        startAviatorUpdates(io, result.id, crashPoint);

        res.json({
          success: true,
          sessionId: result.id
        });
      } catch (error) {
        // Rollback transaction on error
        await run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      logger.error('Start Aviator game error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start game'
      });
    }
  },

  // Cash out from Aviator game
  cashoutAviator: async (req, res) => {
    try {
      const userId = req.user.id;
      const { sessionId, multiplier } = req.body;

      // Validate session
      const sessions = await query(
        `SELECT id, bet_amount, crash_point, status 
         FROM minigame_sessions 
         WHERE id = ? AND user_id = ? AND status = 'active'`,
        [sessionId, userId]
      );

      if (sessions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Active game session not found'
        });
      }

      const session = sessions[0];

      // Validate multiplier
      if (multiplier > session.crash_point) {
        return res.status(400).json({
          success: false,
          message: 'Invalid multiplier'
        });
      }

      // Calculate winnings
      const winAmount = session.bet_amount * multiplier;

      // Start transaction
      await run('BEGIN TRANSACTION');

      try {
        // Update user's balance
        await run(
          'UPDATE users SET balance = balance + ? WHERE id = ?',
          [winAmount, userId]
        );

        // Update session status
        await run(
          `UPDATE minigame_sessions 
           SET status = 'completed', cashout_multiplier = ?, win_amount = ? 
           WHERE id = ?`,
          [multiplier, winAmount, sessionId]
        );

        // Create bet record
        await run(
          `INSERT INTO bets (
            user_id, game_type, bet_amount, odds, status, result, winnings
          ) VALUES (?, 'aviator', ?, ?, 'won', 'cashout', ?)`,
          [userId, session.bet_amount, multiplier, winAmount]
        );

        // Commit transaction
        await run('COMMIT');

        // Emit cashout event via WebSocket
        const io = req.app.get('io');
        io.to(`game-${sessionId}`).emit('aviator-cashout', {
          userId,
          multiplier,
          winAmount
        });

        res.json({
          success: true,
          multiplier,
          winAmount
        });
      } catch (error) {
        // Rollback transaction on error
        await run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      logger.error('Aviator cashout error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process cashout'
      });
    }
  },

  // Get game history
  getGameHistory: async (req, res) => {
    try {
      const { gameType, limit = 20 } = req.query;
      
      const history = await query(
        `SELECT * FROM minigame_sessions 
         WHERE game_type = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [gameType, limit]
      );

      res.json({
        success: true,
        history
      });
    } catch (error) {
      logger.error('Get game history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch game history'
      });
    }
  }
};

// Helper function to fetch games from provider
async function fetchGamesFromProvider(provider) {
  try {
    if (!PROVIDERS[provider]) {
      throw new Error('Invalid provider');
    }

    // Mock API call - replace with actual provider API integration
    const response = await axios.get(`${PROVIDERS[provider].baseUrl}/games`, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS[provider].key}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.games;
  } catch (error) {
    logger.error(`Error fetching games from ${provider}:`, error);
    throw error;
  }
}

// Helper function to generate crash point
function generateCrashPoint() {
  // Mock implementation - replace with actual algorithm
  const random = Math.random();
  return Math.max(1, Math.floor(100 / (random * 100)) / 100);
}

// Helper function to start Aviator updates
function startAviatorUpdates(io, sessionId, crashPoint) {
  let multiplier = 1.00;
  const interval = 100; // Update every 100ms
  const growth = 0.01; // Multiplier growth per interval

  const timer = setInterval(() => {
    multiplier += growth;
    
    // Emit current multiplier
    io.to(`game-${sessionId}`).emit('aviator-update', {
      sessionId,
      multiplier: multiplier.toFixed(2)
    });

    // Check if crashed
    if (multiplier >= crashPoint) {
      clearInterval(timer);
      io.to(`game-${sessionId}`).emit('aviator-crash', {
        sessionId,
        crashPoint: crashPoint.toFixed(2)
      });

      // Update session status
      run(
        `UPDATE minigame_sessions 
         SET status = 'crashed' 
         WHERE id = ? AND status = 'active'`,
        [sessionId]
      ).catch(err => logger.error('Error updating crashed session:', err));
    }
  }, interval);
}

module.exports = miniGamesController;