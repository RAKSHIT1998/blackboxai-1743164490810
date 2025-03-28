const { query, run } = require('../config/db');
const logger = require('../config/logger');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CoinPayments = require('coinpayments');
const Web3 = require('web3');

// Initialize CoinPayments
const coinPayments = new CoinPayments({
  key: process.env.COINPAYMENTS_KEY,
  secret: process.env.COINPAYMENTS_SECRET
});

// Initialize Web3
const web3 = new Web3(process.env.WEB3_PROVIDER);

const paymentController = {
  // Stripe payment
  createStripePayment: async (req, res) => {
    try {
      const { amount, currency = 'usd' } = req.body;
      const userId = req.user.id;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        metadata: { userId }
      });

      // Create transaction record
      await run(
        `INSERT INTO transactions (
          user_id, type, amount, payment_method, status, transaction_id
        ) VALUES (?, 'deposit', ?, 'stripe', 'pending', ?)`,
        [userId, amount, paymentIntent.id]
      );

      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      logger.error('Stripe payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Payment processing failed'
      });
    }
  },

  // Crypto payment
  createCryptoPayment: async (req, res) => {
    try {
      const { amount, currency = 'BTC' } = req.body;
      const userId = req.user.id;

      // Create crypto payment transaction
      const transaction = await coinPayments.createTransaction({
        amount,
        currency1: 'USD',
        currency2: currency
      });

      // Create transaction record
      await run(
        `INSERT INTO transactions (
          user_id, type, amount, payment_method, status, transaction_id
        ) VALUES (?, 'deposit', ?, ?, 'pending', ?)`,
        [userId, amount, currency, transaction.txn_id]
      );

      res.json({
        success: true,
        address: transaction.address,
        amount: transaction.amount,
        txnId: transaction.txn_id
      });
    } catch (error) {
      logger.error('Crypto payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Crypto payment processing failed'
      });
    }
  },

  // Web3 payment
  createWeb3Payment: async (req, res) => {
    try {
      const { amount, walletAddress } = req.body;
      const userId = req.user.id;

      // Create Web3 transaction
      const txHash = await web3.eth.sendTransaction({
        from: process.env.PLATFORM_WALLET,
        to: walletAddress,
        value: web3.utils.toWei(amount.toString(), 'ether')
      });

      // Create transaction record
      await run(
        `INSERT INTO transactions (
          user_id, type, amount, payment_method, status, transaction_id
        ) VALUES (?, 'withdrawal', ?, 'ethereum', 'pending', ?)`,
        [userId, amount, txHash]
      );

      res.json({
        success: true,
        txHash
      });
    } catch (error) {
      logger.error('Web3 payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Web3 payment processing failed'
      });
    }
  },

  // Payment webhook handler
  handleWebhook: async (req, res) => {
    try {
      const { type, data } = req.body;

      switch (type) {
        case 'stripe':
          await handleStripeWebhook(data);
          break;
        case 'coinpayments':
          await handleCryptoWebhook(data);
          break;
        case 'web3':
          await handleWeb3Webhook(data);
          break;
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Webhook handling error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process webhook'
      });
    }
  },

  // Get user transactions
  getUserTransactions: async (req, res) => {
    try {
      const userId = req.user.id;

      const transactions = await query(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      logger.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions'
      });
    }
  }
};

// Helper functions for webhook handling
async function handleStripeWebhook(data) {
  const { transaction_id, status } = data;
  
  await run(
    'UPDATE transactions SET status = ? WHERE transaction_id = ?',
    [status, transaction_id]
  );

  if (status === 'completed') {
    const transaction = await query(
      'SELECT user_id, amount FROM transactions WHERE transaction_id = ?',
      [transaction_id]
    );

    if (transaction.length > 0) {
      await run(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [transaction[0].amount, transaction[0].user_id]
      );
    }
  }
}

async function handleCryptoWebhook(data) {
  const { txn_id, status } = data;

  await run(
    'UPDATE transactions SET status = ? WHERE transaction_id = ?',
    [status, txn_id]
  );

  if (status === 'completed') {
    const transaction = await query(
      'SELECT user_id, amount FROM transactions WHERE transaction_id = ?',
      [txn_id]
    );

    if (transaction.length > 0) {
      await run(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [transaction[0].amount, transaction[0].user_id]
      );
    }
  }
}

async function handleWeb3Webhook(data) {
  const { txHash, status } = data;

  await run(
    'UPDATE transactions SET status = ? WHERE transaction_id = ?',
    [status, txHash]
  );

  if (status === 'completed') {
    const transaction = await query(
      'SELECT user_id, amount FROM transactions WHERE transaction_id = ?',
      [txHash]
    );

    if (transaction.length > 0) {
      await run(
        'UPDATE users SET balance = balance - ? WHERE id = ?',
        [transaction[0].amount, transaction[0].user_id]
      );
    }
  }
}

module.exports = paymentController;