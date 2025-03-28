// API Base URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';

// Sports API Configuration
export const SPORTS_API = {
  ODDSMATRIX: {
    BASE_URL: process.env.REACT_APP_ODDSMATRIX_URL,
    API_KEY: process.env.REACT_APP_ODDSMATRIX_KEY
  },
  BETFAIR: {
    BASE_URL: process.env.REACT_APP_BETFAIR_URL,
    API_KEY: process.env.REACT_APP_BETFAIR_KEY
  },
  SPORTRADAR: {
    BASE_URL: process.env.REACT_APP_SPORTRADAR_URL,
    API_KEY: process.env.REACT_APP_SPORTRADAR_KEY
  }
};

// Casino API Configuration
export const CASINO_API = {
  EVOLUTION: {
    BASE_URL: process.env.REACT_APP_EVOLUTION_URL,
    API_KEY: process.env.REACT_APP_EVOLUTION_KEY
  },
  PRAGMATIC: {
    BASE_URL: process.env.REACT_APP_PRAGMATIC_URL,
    API_KEY: process.env.REACT_APP_PRAGMATIC_KEY
  },
  BGAMING: {
    BASE_URL: process.env.REACT_APP_BGAMING_URL,
    API_KEY: process.env.REACT_APP_BGAMING_KEY
  }
};

// Payment Gateway Configuration
export const PAYMENT_API = {
  STRIPE: {
    PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY
  },
  PAYPAL: {
    CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID
  },
  RAZORPAY: {
    KEY_ID: process.env.REACT_APP_RAZORPAY_KEY_ID
  },
  COINPAYMENTS: {
    MERCHANT_ID: process.env.REACT_APP_COINPAYMENTS_MERCHANT_ID
  },
  NOWPAYMENTS: {
    API_KEY: process.env.REACT_APP_NOWPAYMENTS_API_KEY
  }
};

// Mini Games API Configuration
export const MINIGAMES_API = {
  SPRIBE: {
    BASE_URL: process.env.REACT_APP_SPRIBE_URL,
    API_KEY: process.env.REACT_APP_SPRIBE_KEY
  },
  HACKSAW: {
    BASE_URL: process.env.REACT_APP_HACKSAW_URL,
    API_KEY: process.env.REACT_APP_HACKSAW_KEY
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
};

// Feature Flags
export const FEATURES = {
  ENABLE_2FA: process.env.REACT_APP_ENABLE_2FA === 'true',
  ENABLE_SOCIAL_LOGIN: process.env.REACT_APP_ENABLE_SOCIAL_LOGIN === 'true',
  ENABLE_CRYPTO_PAYMENTS: process.env.REACT_APP_ENABLE_CRYPTO_PAYMENTS === 'true',
  MAINTENANCE_MODE: process.env.REACT_APP_MAINTENANCE_MODE === 'true'
};