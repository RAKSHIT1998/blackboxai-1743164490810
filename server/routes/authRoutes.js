const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, verifyAdminCredentials } = require('../config/jwtConfig');
const logger = require('../config/logger');

// Middleware to log auth requests
const logAuthRequest = (req, res, next) => {
  logger.authLog(`${req.method} ${req.originalUrl}`);
  next();
};

router.use(logAuthRequest);

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Admin login
router.post('/admin/login', verifyAdminCredentials, authController.adminLogin);

// Google OAuth authentication
router.post('/google', authController.googleAuth);

// MetaMask wallet connection
router.post('/connect-wallet', authenticateToken, authController.connectWallet);

// Password reset request
router.post('/reset-password', authController.requestPasswordReset);

// Verify token (used by frontend to check if token is still valid)
router.get('/verify', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Logout (client-side only - invalidate token)
router.post('/logout', authenticateToken, (req, res) => {
  try {
    logger.authLog('User logged out', req.user.id);
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  logger.error('Auth route error:', err);
  res.status(500).json({
    success: false,
    message: 'Authentication error occurred'
  });
});

module.exports = router;