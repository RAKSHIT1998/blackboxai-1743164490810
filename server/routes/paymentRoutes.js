const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../config/jwtConfig');
const paymentController = require('../controllers/paymentController');

// Payment routes
router.post('/stripe/create', authenticateToken, paymentController.createStripePayment);
router.post('/crypto/create', authenticateToken, paymentController.createCryptoPayment);
router.post('/web3/create', authenticateToken, paymentController.createWeb3Payment);
router.post('/webhook', paymentController.handleWebhook);
router.get('/transactions', authenticateToken, paymentController.getUserTransactions);

module.exports = router;