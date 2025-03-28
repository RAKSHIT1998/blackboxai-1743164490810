import React, { createContext, useContext, useState, useEffect } from 'react';
import paymentService from '../services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [balance, setBalance] = useState({
    fiat: 0,
    btc: 0,
    eth: 0,
    usdt: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kycStatus, setKycStatus] = useState('pending');

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [balanceData, transactionsData, kycData] = await Promise.all([
          paymentService.getBalance(),
          paymentService.getTransactions(),
          paymentService.getKYCStatus()
        ]);

        setBalance(balanceData.balance);
        setTransactions(transactionsData.transactions);
        setKycStatus(kycData.status);
      } catch (err) {
        setError('Failed to fetch payment data');
        console.error('Payment data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Deposit methods
  const deposit = async (amount, method, currency = 'usd') => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method) {
        case 'stripe':
          response = await paymentService.createStripePayment(amount, currency);
          break;
        case 'paypal':
          response = await paymentService.createPayPalPayment(amount, currency);
          break;
        case 'razorpay':
          response = await paymentService.createRazorpayPayment(amount, currency);
          break;
        case 'upi':
          response = await paymentService.createUPIPayment(amount);
          break;
        case 'skrill':
          response = await paymentService.createSkrillPayment(amount, currency);
          break;
        case 'neteller':
          response = await paymentService.createNetellerPayment(amount, currency);
          break;
        case 'bitcoin':
        case 'ethereum':
        case 'usdt':
          response = await paymentService.createCryptoPayment(amount, method);
          break;
        default:
          throw new Error('Invalid payment method');
      }

      // Update balance and transactions after successful deposit
      const [newBalance, newTransactions] = await Promise.all([
        paymentService.getBalance(),
        paymentService.getTransactions()
      ]);

      setBalance(newBalance.balance);
      setTransactions(newTransactions.transactions);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to process deposit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Withdrawal methods
  const withdraw = async (amount, method, details) => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentService.requestWithdrawal(amount, method, details);

      // Update balance and transactions after successful withdrawal request
      const [newBalance, newTransactions] = await Promise.all([
        paymentService.getBalance(),
        paymentService.getTransactions()
      ]);

      setBalance(newBalance.balance);
      setTransactions(newTransactions.transactions);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to process withdrawal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // KYC methods
  const submitKYC = async (documents) => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentService.submitKYC(documents);
      setKycStatus(response.status);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to submit KYC documents');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Connect wallet
  const connectWallet = async (walletAddress) => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentService.createWeb3Payment(0, walletAddress);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    balance,
    transactions,
    loading,
    error,
    kycStatus,
    deposit,
    withdraw,
    submitKYC,
    connectWallet,
    clearError: () => setError(null)
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;