const { query, run } = require('../config/db');
const logger = require('../config/logger');
const axios = require('axios');

// Mock API endpoints - replace with actual provider endpoints
const PROVIDERS = {
  evolution: {
    baseUrl: process.env.EVOLUTION_API_URL,
    key: process.env.EVOLUTION_API_KEY
  },
  pragmatic: {
    baseUrl: process.env.PRAGMATIC_API_URL,
    key: process.env.PRAGMATIC_API_KEY
  },
  bgaming: {
    baseUrl: process.env.BGAMING_API_URL,
    key: process.env.BGAMING_API_KEY
  }
};

const casinoController = {
  // Get available casino games
  getGames: async (req, res) => {
    try {
      const { provider, category } = req.query;
      
      // Get games from provider's API
      const games = await fetchGamesFromProvider(provider, category);
      
      res.json({
        success: true,
        games
      });
    } catch (error) {
      logger.error('Get casino games error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch casino games'
      });
    }
  },

  // Launch casino game session
  launchGame: async (req, res) => {
    try {
      const { gameId, provider } = req.body;
      const userId = req.user.id;

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

      // Create game session with provider
      const session = await createGameSession(provider, gameId, userId, users[0].balance);

      // Log game launch
      await run(
        `INSERT INTO game_sessions (
          user_id, game_id, provider, session_id, status
        ) VALUES (?, ?, ?, ?, 'active')`,
        [userId, gameId, provider, session.sessionId]
      );

      res.json({
        success: true,
        launchUrl: session.launchUrl,
        sessionId: session.sessionId
      });
    } catch (error) {
      logger.error('Launch casino game error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to launch game'
      });
    }
  },

  // Handle game result
  handleGameResult: async (req, res) => {
    try {
      const { sessionId, result, winAmount } = req.body;

      // Verify game session
      const sessions = await query(
        `SELECT user_id, game_id, provider 
         FROM game_sessions 
         WHERE session_id = ? AND status = 'active'`,
        [sessionId]
      );

      if (sessions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Game session not found'
        });
      }

      const session = sessions[0];

      // Start transaction
      await run('BEGIN TRANSACTION');

      try {
        // Update user's balance
        if (winAmount > 0) {
          await run(
            'UPDATE users SET balance = balance + ? WHERE id = ?',
            [winAmount, session.user_id]
          );
        }

        // Update game session status
        await run(
          `UPDATE game_sessions 
           SET status = 'completed', result = ?, win_amount = ? 
           WHERE session_id = ?`,
          [result, winAmount, sessionId]
        );

        // Create bet record
        await run(
          `INSERT INTO bets (
            user_id, game_type, bet_amount, odds, status, result, winnings
          ) VALUES (?, 'casino', ?, 1, ?, ?, ?)`,
          [session.user_id, 0, result === 'win' ? 'won' : 'lost', result, winAmount]
        );

        // Commit transaction
        await run('COMMIT');

        // Emit real-time update via WebSocket
        const io = req.app.get('io');
        io.to(`user-${session.user_id}`).emit('game-result', {
          sessionId,
          result,
          winAmount
        });

        res.json({ success: true });
      } catch (error) {
        // Rollback transaction on error
        await run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      logger.error('Handle game result error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process game result'
      });
    }
  }
};

// Helper function to fetch games from provider
async function fetchGamesFromProvider(provider, category) {
  try {
    if (!PROVIDERS[provider]) {
      throw new Error('Invalid provider');
    }

    // Mock API call - replace with actual provider API integration
    const response = await axios.get(`${PROVIDERS[provider].baseUrl}/games`, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS[provider].key}`,
        'Content-Type': 'application/json'
      },
      params: { category }
    });

    return response.data.games;
  } catch (error) {
    logger.error(`Error fetching games from ${provider}:`, error);
    throw error;
  }
}

// Helper function to create game session with provider
async function createGameSession(provider, gameId, userId, balance) {
  try {
    if (!PROVIDERS[provider]) {
      throw new Error('Invalid provider');
    }

    // Mock API call - replace with actual provider API integration
    const response = await axios.post(`${PROVIDERS[provider].baseUrl}/sessions`, {
      gameId,
      userId,
      balance,
      currency: 'USD',
      language: 'en'
    }, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS[provider].key}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      sessionId: response.data.sessionId,
      launchUrl: response.data.launchUrl
    };
  } catch (error) {
    logger.error(`Error creating game session with ${provider}:`, error);
    throw error;
  }
}

module.exports = casinoController;