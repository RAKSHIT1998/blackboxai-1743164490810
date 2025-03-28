import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock user balance - will be replaced with API data
  const [balance, setBalance] = useState({
    fiat: 1250.50,
    btc: 0.025,
    eth: 0.5
  });

  const paymentMethods = {
    fiat: [
      { id: 'stripe', name: 'Credit/Debit Card', icon: 'fa-credit-card' },
      { id: 'paypal', name: 'PayPal', icon: 'fa-paypal' },
      { id: 'razorpay', name: 'Razorpay', icon: 'fa-money-bill-wave' },
      { id: 'upi', name: 'UPI', icon: 'fa-university' },
      { id: 'skrill', name: 'Skrill', icon: 'fa-wallet' },
      { id: 'neteller', name: 'Neteller', icon: 'fa-money-check' }
    ],
    crypto: [
      { id: 'bitcoin', name: 'Bitcoin', icon: 'fa-bitcoin' },
      { id: 'ethereum', name: 'Ethereum', icon: 'fa-ethereum' },
      { id: 'usdt', name: 'USDT', icon: 'fa-dollar-sign' }
    ]
  };

  const handleDeposit = async () => {
    setLoading(true);
    setError('');

    try {
      // API call will be implemented here
      console.log('Processing deposit:', { amount, method: selectedMethod });
      
      // Mock successful deposit
      setTimeout(() => {
        setShowPaymentModal(false);
        setLoading(false);
        // Show success notification
      }, 2000);
    } catch (err) {
      setError('Failed to process deposit. Please try again.');
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setError('');

    try {
      // API call will be implemented here
      console.log('Processing withdrawal:', { amount, method: selectedMethod });
      
      // Mock successful withdrawal
      setTimeout(() => {
        setShowPaymentModal(false);
        setLoading(false);
        // Show success notification
      }, 2000);
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
        <p className="text-gray-400">Manage your deposits and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="betting-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Fiat Balance</h3>
            <i className="fas fa-dollar-sign text-indigo-500 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-white">${balance.fiat.toFixed(2)}</p>
        </div>

        <div className="betting-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Bitcoin Balance</h3>
            <i className="fab fa-bitcoin text-indigo-500 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-white">{balance.btc} BTC</p>
        </div>

        <div className="betting-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Ethereum Balance</h3>
            <i className="fab fa-ethereum text-indigo-500 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-white">{balance.eth} ETH</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => {
            setSelectedMethod(null);
            setShowPaymentModal(true);
          }}
          className="btn-primary px-8 py-3"
        >
          <i className="fas fa-plus mr-2"></i>
          Deposit
        </button>
        <button
          onClick={() => {
            setSelectedMethod(null);
            setShowPaymentModal(true);
          }}
          className="btn-secondary px-8 py-3"
        >
          <i className="fas fa-minus mr-2"></i>
          Withdraw
        </button>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Select Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {error && (
              <div className="alert-error mb-4">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Fiat Methods</h3>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.fiat.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-lg border ${
                      selectedMethod === method.id
                        ? 'border-indigo-500 bg-indigo-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-indigo-500'
                    } transition-colors duration-200`}
                  >
                    <i className={`fas ${method.icon} text-2xl mb-2 text-indigo-500`}></i>
                    <p className="text-sm text-white">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Crypto Methods</h3>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.crypto.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-lg border ${
                      selectedMethod === method.id
                        ? 'border-indigo-500 bg-indigo-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-indigo-500'
                    } transition-colors duration-200`}
                  >
                    <i className={`fab ${method.icon} text-2xl mb-2 text-indigo-500`}></i>
                    <p className="text-sm text-white">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleDeposit}
                disabled={!selectedMethod || !amount || loading}
                className="btn-primary flex-1 py-3"
              >
                {loading ? (
                  <div className="spinner mr-2"></div>
                ) : (
                  <i className="fas fa-plus mr-2"></i>
                )}
                {loading ? 'Processing...' : 'Deposit'}
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!selectedMethod || !amount || loading}
                className="btn-secondary flex-1 py-3"
              >
                {loading ? (
                  <div className="spinner mr-2"></div>
                ) : (
                  <i className="fas fa-minus mr-2"></i>
                )}
                {loading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;