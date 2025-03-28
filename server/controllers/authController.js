const bcrypt = require('bcryptjs');
const { query, run } = require('../config/db');
const { generateToken } = require('../config/jwtConfig');
const logger = require('../config/logger');

const authController = {
  // User registration
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Check if user already exists
      const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const result = await run(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        [email, passwordHash, name]
      );

      // Generate JWT token
      const user = {
        id: result.id,
        email,
        name,
        role: 'user'
      };
      const token = generateToken(user);

      logger.authLog('New user registered', result.id);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: result.id,
          email,
          name,
          role: 'user'
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const users = await query(
        'SELECT id, email, name, password_hash, role, is_verified FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.authLog('User logged in', user.id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.is_verified === 1
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  },

  // Admin login
  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate admin credentials
      if (username !== 'Rakshit@9858' || password !== '9858224000') {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin credentials'
        });
      }

      // Generate admin JWT token
      const adminUser = {
        id: 1,
        email: username,
        role: 'admin'
      };
      const token = generateToken(adminUser);

      logger.adminLog('Admin logged in');

      res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          id: 1,
          email: username,
          role: 'admin'
        }
      });
    } catch (error) {
      logger.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Admin login failed'
      });
    }
  },

  // Google OAuth login/register
  googleAuth: async (req, res) => {
    try {
      const { googleId, email, name } = req.body;

      // Check if user exists
      let users = await query('SELECT id, email, name, role FROM users WHERE google_id = ?', [googleId]);
      let user;

      if (users.length === 0) {
        // Create new user
        const result = await run(
          'INSERT INTO users (email, name, google_id, is_verified) VALUES (?, ?, ?, 1)',
          [email, name, googleId]
        );

        user = {
          id: result.id,
          email,
          name,
          role: 'user'
        };

        logger.authLog('New user registered via Google', result.id);
      } else {
        user = users[0];
        logger.authLog('User logged in via Google', user.id);
      }

      // Generate JWT token
      const token = generateToken(user);

      res.json({
        success: true,
        message: 'Google authentication successful',
        token,
        user
      });
    } catch (error) {
      logger.error('Google authentication error:', error);
      res.status(500).json({
        success: false,
        message: 'Google authentication failed'
      });
    }
  },

  // MetaMask wallet connection
  connectWallet: async (req, res) => {
    try {
      const { userId, walletAddress } = req.body;

      // Update user's wallet address
      await run(
        'UPDATE users SET wallet_address = ? WHERE id = ?',
        [walletAddress, userId]
      );

      logger.authLog(`Wallet connected: ${walletAddress}`, userId);

      res.json({
        success: true,
        message: 'Wallet connected successfully'
      });
    } catch (error) {
      logger.error('Wallet connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to connect wallet'
      });
    }
  },

  // Password reset request
  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const users = await query('SELECT id FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // In a real application, send password reset email here
      logger.authLog('Password reset requested', users[0].id);

      res.json({
        success: true,
        message: 'Password reset instructions sent to email'
      });
    } catch (error) {
      logger.error('Password reset request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request'
      });
    }
  }
};

module.exports = authController;