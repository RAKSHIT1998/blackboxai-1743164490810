const bcrypt = require('bcryptjs');
const { query, run } = require('../config/db');
const logger = require('../config/logger');

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const users = await query(
        `SELECT id, email, name, balance, wallet_address, is_verified, created_at 
         FROM users WHERE id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      // Get user's betting history
      const bets = await query(
        `SELECT id, game_type, bet_amount, odds, status, result, winnings, created_at 
         FROM bets WHERE user_id = ? 
         ORDER BY created_at DESC LIMIT 10`,
        [userId]
      );

      // Get user's transaction history
      const transactions = await query(
        `SELECT id, type, amount, payment_method, status, created_at 
         FROM transactions WHERE user_id = ? 
         ORDER BY created_at DESC LIMIT 10`,
        [userId]
      );

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          balance: user.balance,
          walletAddress: user.wallet_address,
          isVerified: user.is_verified === 1,
          createdAt: user.created_at,
          bettingHistory: bets,
          transactions: transactions
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, email, currentPassword, newPassword } = req.body;

      // Get current user data
      const users = await query(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // If updating password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is required'
          });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await run(
          'UPDATE users SET password_hash = ? WHERE id = ?',
          [passwordHash, userId]
        );
      }

      // Update other profile information
      if (name || email) {
        const updates = [];
        const values = [];

        if (name) {
          updates.push('name = ?');
          values.push(name);
        }

        if (email) {
          // Check if email is already taken
          const existingUser = await query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
          );

          if (existingUser.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Email already in use'
            });
          }

          updates.push('email = ?');
          values.push(email);
        }

        if (updates.length > 0) {
          values.push(userId);
          await run(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
          );
        }
      }

      logger.info(`Profile updated for user ${userId}`);

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  },

  // Get user balance
  getBalance: async (req, res) => {
    try {
      const userId = req.user.id;

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

      res.json({
        success: true,
        balance: users[0].balance
      });
    } catch (error) {
      logger.error('Get balance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch balance'
      });
    }
  },

  // Get betting history
  getBettingHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, game_type, bet_amount, odds, status, result, winnings, created_at 
        FROM bets 
        WHERE user_id = ?
      `;
      const queryParams = [userId];

      if (status) {
        query += ' AND status = ?';
        queryParams.push(status);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), offset);

      const bets = await query(query, queryParams);

      // Get total count for pagination
      const [{ total }] = await query(
        'SELECT COUNT(*) as total FROM bets WHERE user_id = ?',
        [userId]
      );

      res.json({
        success: true,
        bets,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get betting history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch betting history'
      });
    }
  },

  // Get transaction history
  getTransactionHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, type, amount, payment_method, status, created_at 
        FROM transactions 
        WHERE user_id = ?
      `;
      const queryParams = [userId];

      if (type) {
        query += ' AND type = ?';
        queryParams.push(type);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), offset);

      const transactions = await query(query, queryParams);

      // Get total count for pagination
      const [{ total }] = await query(
        'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?',
        [userId]
      );

      res.json({
        success: true,
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get transaction history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transaction history'
      });
    }
  }
};

module.exports = userController;