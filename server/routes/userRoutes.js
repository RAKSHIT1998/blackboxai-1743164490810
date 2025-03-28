const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../config/jwtConfig');
const logger = require('../config/logger');

// Middleware to log user requests
const logUserRequest = (req, res, next) => {
  logger.info(`User API Request: ${req.method} ${req.originalUrl}`);
  next();
};

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(logUserRequest);

// Get user profile with betting history and transactions
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Get user balance
router.get('/balance', userController.getBalance);

// Get betting history with pagination and filters
router.get('/betting-history', userController.getBettingHistory);

// Get transaction history with pagination and filters
router.get('/transactions', userController.getTransactionHistory);

// Error handling middleware
router.use((err, req, res, next) => {
  logger.error('User route error:', err);
  res.status(500).json({
    success: false,
    message: 'An error occurred while processing your request'
  });
});

// Input validation middleware example
const validateProfileUpdate = (req, res, next) => {
  const { name, email, currentPassword, newPassword } = req.body;

  if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  if (name && (name.length < 2 || name.length > 50)) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters'
    });
  }

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required when updating password'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }
  }

  next();
};

// Apply validation middleware to profile update route
router.put('/profile', validateProfileUpdate, userController.updateProfile);

// Pagination middleware
const paginationMiddleware = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters'
    });
  }

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };

  next();
};

// Apply pagination middleware to history routes
router.get('/betting-history', paginationMiddleware, userController.getBettingHistory);
router.get('/transactions', paginationMiddleware, userController.getTransactionHistory);

// Rate limiting middleware example
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Apply rate limiting to all routes
router.use(apiLimiter);

// Cache middleware example for balance endpoint
const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = `user-balance-${req.user.id}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};

// Apply cache middleware to balance endpoint (cache for 30 seconds)
router.get('/balance', cacheMiddleware(30), userController.getBalance);

// WebSocket notification example for balance updates
const notifyBalanceUpdate = (userId, newBalance) => {
  const io = req.app.get('io');
  io.to(`user-${userId}`).emit('balance-update', {
    balance: newBalance
  });
};

module.exports = router;