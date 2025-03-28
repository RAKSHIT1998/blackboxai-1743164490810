import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data - will be replaced with API data
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    balance: 1250.50,
    joinDate: '2024-01-15',
    bettingHistory: [
      {
        id: 1,
        type: 'sports',
        event: 'Manchester United vs Liverpool',
        bet: 'Home Win',
        amount: 100,
        odds: 2.1,
        status: 'won',
        winnings: 210,
        date: '2024-02-18'
      },
      {
        id: 2,
        type: 'casino',
        event: 'Blackjack',
        bet: 'Player',
        amount: 50,
        odds: 1.95,
        status: 'lost',
        winnings: 0,
        date: '2024-02-17'
      }
    ],
    transactions: [
      {
        id: 1,
        type: 'deposit',
        method: 'Credit Card',
        amount: 500,
        status: 'completed',
        date: '2024-02-16'
      },
      {
        id: 2,
        type: 'withdrawal',
        method: 'Bank Transfer',
        amount: 1000,
        status: 'pending',
        date: '2024-02-15'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      case 'completed':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="betting-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Balance</h3>
          <i className="fas fa-wallet text-indigo-500 text-xl"></i>
        </div>
        <p className="text-2xl font-bold text-white">${userData.balance.toFixed(2)}</p>
        <div className="mt-4">
          <Link to="/wallet" className="btn-primary w-full flex justify-center items-center">
            <i className="fas fa-wallet mr-2"></i>
            Manage Wallet
          </Link>
        </div>
      </div>

      <div className="betting-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Betting Stats</h3>
          <i className="fas fa-chart-bar text-indigo-500 text-xl"></i>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Bets</span>
            <span className="text-white font-semibold">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Win Rate</span>
            <span className="text-green-400 font-semibold">65%</span>
          </div>
        </div>
      </div>

      <div className="betting-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Account Status</h3>
          <i className="fas fa-user-shield text-indigo-500 text-xl"></i>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Member Since</span>
            <span className="text-white">{userData.joinDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Verification</span>
            <span className="text-green-400">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBettingHistory = () => (
    <div className="betting-card overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Bet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Odds
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Winnings
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {userData.bettingHistory.map((bet) => (
            <tr key={bet.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {bet.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {bet.event}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {bet.bet}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${bet.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {bet.odds}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={getStatusColor(bet.status)}>
                  {bet.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${bet.winnings}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTransactions = () => (
    <div className="betting-card overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {userData.transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {transaction.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {transaction.method}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${transaction.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={getStatusColor(transaction.status)}>
                  {transaction.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSettings = () => (
    <div className="betting-card">
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            className="form-input"
            defaultValue={userData.name}
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="form-input"
            defaultValue={userData.email}
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">New Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm new password"
          />
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary w-full">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Manage your account and view your betting history</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-8 bg-gray-800 rounded-lg p-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-home mr-2"></i>
          Overview
        </button>
        <button
          onClick={() => setActiveTab('betting-history')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'betting-history' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-history mr-2"></i>
          Betting History
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-exchange-alt mr-2"></i>
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-cog mr-2"></i>
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'betting-history' && renderBettingHistory()}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default Profile;