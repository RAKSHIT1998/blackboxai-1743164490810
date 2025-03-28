const { query, run } = require('../config/db');
const logger = require('../config/logger');
const axios = require('axios');

// Mock API endpoints - replace with actual provider endpoints
const PROVIDERS = {
  oddsmatrix: {
    baseUrl: process.env.ODDSMATRIX_API_URL,
    key: process.env.ODDSMATRIX_API_KEY
  },
  betfair: {
    baseUrl: process.env.BETFAIR_API_URL,
    key: process.env.BETFAIR_API_KEY
  },
  sportradar: {
    baseUrl: process.env.SPORTRADAR_API_URL,
    key: process.env.SPORTRADAR_API_KEY
  }
};

const sportsController = {
  // Get available sports
  getSports: async (req, res) => {
    try {
      // Get sports from provider's API
      const sports = await fetchSportsFromProvider();
      
      res.json({
        success: true,
        sports
      });
    } catch (error) {
      logger.error('Get sports error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sports'
      });
    }
  },

  // Get live matches and odds
  getLiveMatches: async (req, res) => {
    try {
      const { sportId } = req.query;
      
      // Get live matches from provider's API
      const matches = await fetchLiveMatches(sportId);
      
      res.json({
        success: true,
        matches
      });
    } catch (error) {
      logger.error('Get live matches error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch live matches'
      });
    }
  },

  // Get upcoming matches
  getUpcomingMatches: async (req, res) => {
    try {
      const { sportId, days = 7 } = req.query;
      
      // Get upcoming matches from provider's API
      const matches = await fetchUpcomingMatches(sportId, days);
      
      res.json({
        success: true,
        matches
      });
    } catch (error) {
      logger.error('Get upcoming matches error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming matches'
      });
    }
  },

  // Place sports bet
  placeBet: async (req, res) => {
    try {
      const userId = req.user.id;
      const { matchId, betType, stake, odds } = req.body;

      // Validate bet
      if (!matchId || !betType || !stake || !odds) {
        return res.status(400).json({
          success: false,
          message: 'All bet details are required'
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

      if (users[0].balance < stake) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Start transaction
      await run('BEGIN TRANSACTION');

      try {
        // Deduct stake from user's balance
        await run(
          'UPDATE users SET balance = balance - ? WHERE id = ?',
          [stake, userId]
        );

        // Create bet record
        const result = await run(
          `INSERT INTO bets (
            user_id, game_type, bet_amount, odds, status, selection, match_id
          ) VALUES (?, 'sports', ?, ?, 'pending', ?, ?)`,
          [userId, stake, odds, betType, matchId]
        );

        // Commit transaction
        await run('COMMIT');

        // Emit real-time update via WebSocket
        const io = req.app.get('io');
        io.to(`user-${userId}`).emit('bet-placed', {
          betId: result.id,
          matchId,
          betType,
          stake,
          odds
        });

        res.json({
          success: true,
          message: 'Bet placed successfully',
          betId: result.id
        });
      } catch (error) {
        // Rollback transaction on error
        await run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      logger.error('Place sports bet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to place bet'
      });
    }
  },

  // Get match details and live stats
  getMatchDetails: async (req, res) => {
    try {
      const { matchId } = req.params;
      
      // Get match details from provider's API
      const details = await fetchMatchDetails(matchId);
      
      res.json({
        success: true,
        details
      });
    } catch (error) {
      logger.error('Get match details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch match details'
      });
    }
  },

  // Subscribe to odds updates
  subscribeToOdds: async (req, res) => {
    try {
      const { matchId } = req.params;
      const io = req.app.get('io');

      // Subscribe to odds updates from provider
      const subscription = await subscribeToOddsUpdates(matchId, (update) => {
        io.to(`match-${matchId}`).emit('odds-update', update);
      });

      res.json({
        success: true,
        subscriptionId: subscription.id
      });
    } catch (error) {
      logger.error('Subscribe to odds error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to subscribe to odds updates'
      });
    }
  }
};

// Helper function to fetch sports from provider
async function fetchSportsFromProvider() {
  try {
    // Mock API call - replace with actual provider API integration
    const response = await axios.get(`${PROVIDERS.oddsmatrix.baseUrl}/sports`, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS.oddsmatrix.key}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.sports;
  } catch (error) {
    logger.error('Error fetching sports:', error);
    throw error;
  }
}

// Helper function to fetch live matches
async function fetchLiveMatches(sportId) {
  try {
    // Mock API call - replace with actual provider API integration
    const response = await axios.get(`${PROVIDERS.oddsmatrix.baseUrl}/matches/live`, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS.oddsmatrix.key}`,
        'Content-Type': 'application/json'
      },
      params: { sportId }
    });

    return response.data.matches;
  } catch (error) {
    logger.error('Error fetching live matches:', error);
    throw error;
  }
}

// Helper function to fetch upcoming matches
async function fetchUpcomingMatches(sportId, days) {
  try {
    // Mock API call - replace with actual provider API integration
    const response = await axios.get(`${PROVIDERS.oddsmatrix.baseUrl}/matches/upcoming`, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS.oddsmatrix.key}`,
        'Content-Type': 'application/json'
      },
      params: { sportId, days }
    });

    return response.data.matches;
  } catch (error) {
    logger.error('Error fetching upcoming matches:', error);
    throw error;
  }
}

// Helper function to fetch match details
async function fetchMatchDetails(matchId) {
  try {
    // Mock API call - replace with actual provider API integration
    const response = await axios.get(`${PROVIDERS.sportradar.baseUrl}/matches/${matchId}`, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS.sportradar.key}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    logger.error('Error fetching match details:', error);
    throw error;
  }
}

// Helper function to subscribe to odds updates
async function subscribeToOddsUpdates(matchId, callback) {
  try {
    // Mock API call - replace with actual provider API integration
    const response = await axios.post(`${PROVIDERS.oddsmatrix.baseUrl}/odds/subscribe`, {
      matchId
    }, {
      headers: {
        'Authorization': `Bearer ${PROVIDERS.oddsmatrix.key}`,
        'Content-Type': 'application/json'
      }
    });

    // Mock subscription handling
    setInterval(() => {
      callback({
        matchId,
        odds: {
          home: Math.random() * 3 + 1,
          draw: Math.random() * 3 + 2,
          away: Math.random() * 3 + 1
        },
        timestamp: new Date().toISOString()
      });
    }, 5000);

    return response.data;
  } catch (error) {
    logger.error('Error subscribing to odds updates:', error);
    throw error;
  }
}

module.exports = sportsController;