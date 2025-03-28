import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const paymentService = {
  // Fiat payment methods
  createStripePayment: async (amount, currency = 'usd') => {
    const response = await axios.post(`${API_URL}/payments/stripe/create`, {
      amount,
      currency
    });
    return response.data;
  },

  createPayPalPayment: async (amount, currency = 'usd') => {
    const response = await axios.post(`${API_URL}/payments/paypal/create`, {
      amount,
      currency
    });
    return response.data;
  },

  createRazorpayPayment: async (amount, currency = 'INR') => {
    const response = await axios.post(`${API_URL}/payments/razorpay/create`, {
      amount,
      currency
    });
    return response.data;
  },

  createUPIPayment: async (amount, vpa) => {
    const response = await axios.post(`${API_URL}/payments/upi/create`, {
      amount,
      vpa
    });
    return response.data;
  },

  createSkrillPayment: async (amount, currency = 'usd') => {
    const response = await axios.post(`${API_URL}/payments/skrill/create`, {
      amount,
      currency
    });
    return response.data;
  },

  createNetellerPayment: async (amount, currency = 'usd') => {
    const response = await axios.post(`${API_URL}/payments/neteller/create`, {
      amount,
      currency
    });
    return response.data;
  },

  // Crypto payment methods
  createCryptoPayment: async (amount, currency) => {
    const response = await axios.post(`${API_URL}/payments/crypto/create`, {
      amount,
      currency
    });
    return response.data;
  },

  createWeb3Payment: async (amount, walletAddress) => {
    const response = await axios.post(`${API_URL}/payments/web3/create`, {
      amount,
      walletAddress
    });
    return response.data;
  },

  // Transaction history
  getTransactions: async () => {
    const response = await axios.get(`${API_URL}/payments/transactions`);
    return response.data;
  },

  // Balance
  getBalance: async () => {
    const response = await axios.get(`${API_URL}/payments/balance`);
    return response.data;
  },

  // Withdrawal
  requestWithdrawal: async (amount, method, details) => {
    const response = await axios.post(`${API_URL}/payments/withdraw`, {
      amount,
      method,
      details
    });
    return response.data;
  },

  // KYC verification
  submitKYC: async (documents) => {
    const formData = new FormData();
    Object.keys(documents).forEach(key => {
      formData.append(key, documents[key]);
    });

    const response = await axios.post(`${API_URL}/payments/kyc/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getKYCStatus: async () => {
    const response = await axios.get(`${API_URL}/payments/kyc/status`);
    return response.data;
  },

  // Request handlers
  setRequestInterceptor: (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },

  setResponseInterceptor: (onUnauthorized) => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
};

export default paymentService;