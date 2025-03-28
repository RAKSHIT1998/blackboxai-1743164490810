const express = require('express');
const router = express.Router();
const betController = require('../controllers/betController');
const { authenticateToken } = require('../config/jwtConfig');
const logger = require('../config/logger');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Middleware to log bet requests
const logBetRequest = (req, res, next) => {
  logger.betLog(`${req.method} ${req.originalUrl}`, req.user.id);
  next();
};

router.use(logBetRequest);

// Bet amount validation middleware
const validateBetAmount = (req, res, next) => {
  const { betAmount } = req.body;
  
  if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid bet amount'
    });
  }

  // Convert bet amount to number
  req.body.betAmount = parseFloat(betAmount);
  next();
};

// Odds validation middleware
const validateOdds = (req, res, next) => {
  const { odds } = req.body;
  
  if (!odds || isNaN(odds) || odds < 1) {
    return res.status(400).json({
      success: false,
      message: 'Invalid odds'
    });
  }

  // Convert odds to number
  req.body.odds = parseFloat(odds);
  next();
};

// Game type validation middleware
const validateGameType = (req, res, next) => {
  const validGameTypes = ['sports', 'casino', 'mini-games'];
  const { gameType } = req.body;

  if (!gameType || !validGameTypes.includes(gameType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid game type'
    });
  }

  next();
};

// Rate limiting for bet placement
const rateLimit = require('express-rate-limit');

const betLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 bets per minute
  message: {
    success: false,
    message: 'Too many bets placed, please try again later'
  }
});

// Place a new bet
router.post(
  '/place',
  betLimiter,
  validateBetAmount,
  validateOdds,
  validateGameType,
  betController.placeBet
);

// Get bet details
router.get('/:betId', betController.getBet);

// Process bet result (admin only)
router.post(
  '/:betId/result',
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
    next();
  },
  betController.processBetResult
);

// Get live odds
router.get('/odds/live', betController.getLiveOdds);

// Get betting statistics
router.get('/stats/summary', betController.getBetStats);

// WebSocket setup for real-time odds updates
const setupBetWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info('Client connected to bet WebSocket');

    // Subscribe to odds updates for specific game types
    socket.on('subscribe_odds', (gameType) => {
      socket.join(`odds_${gameType}`);
      logger.info(`Client subscribed to ${gameType} odds updates`);
    });

    // Unsubscribe from odds updates
    socket.on('unsubscribe_odds', (gameType) => {
      socket.leave(`odds_${gameType}`);
      logger.info(`Client unsubscribed from ${gameType} odds updates`);
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected from bet WebSocket');
    });
  });

  // Example of broadcasting odds updates
  setInterval(() => {
    // Mock odds update - in production, this would be triggered by real events
    const sportsOdds = {
      eventId: 1,
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      odds: {
        home: 2.1 + Math.random() * 0.2,
        draw: 3.4 + Math.random() * 0.2,
        away: 3.2 + Math.random() * 0.2
      }
    };

    io.to('odds_sports').emit('odds_update', sportsOdds);
  }, 5000); // Update every 5 seconds
};

// Error handling middleware
router.use((err, req, res, next) => {
  logger.error('Bet route error:', err);
  res.status(500).json({
    success: false,
    message: 'An error occurred while processing your bet'
  });
});

module.exports = {
  router,
  setupBetWebSocket
};