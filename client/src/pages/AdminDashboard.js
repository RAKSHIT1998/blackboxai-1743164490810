import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data - will be replaced with API data
  const adminData = {
    totalUsers: 1250,
    activeUsers: 450,
    totalBets: 5678,
    totalTransactions: 3456,
    revenue: 125000,
    recentTransactions: [
      {
        id: 1,
        user: 'john@example.com',
        type: 'deposit',
        amount: 1000,
        method: 'Credit Card',
        status: 'completed',
        date: '2024-02-19 14:30'
      },
      {
        id: 2,
        user: 'alice@example.com',
        type: 'withdrawal',
        amount: 500,
        method: 'Bank Transfer',
        status: 'pending',
        date: '2024-02-19 13:45'
      }
    ],
    suspiciousActivities: [
      {
        id: 1,
        user: 'suspicious@example.com',
        activity: 'Multiple failed login attempts',
        severity: 'high',
        date: '2024-02-19 12:00'
      },
      {
        id: 2,
        user: 'risk@example.com',
        activity: 'Unusual betting pattern',
        severity: 'medium',
        date: '2024-02-19 11:30'
      }
    ],
    kycRequests: [
      {
        id: 1,
        user: 'pending@example.com',
        status: 'pending',
        documents: ['ID', 'Proof of Address'],
        submittedDate: '2024-02-18'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="betting-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Users</h3>
            <i className="fas fa-users text-indigo-500 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-white">{adminData.totalUsers}</p>
          <p className="text-sm text-gray-400 mt-2">
            {adminData.activeUsers} active now
          </p>
        </div>

        <div className="betting-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Bets</h3>
            <i className="fas fa-dice text-indigo-500 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-white">{adminData.totalBets}</p>
          <p className="text-sm text-gray-400 mt-2">
            Last 24 hours
          </p>
        </div>

        <div className="betting-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Revenue</h3>
            <i className="fas fa-chart-line text-indigo-500 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-white">
            ${adminData.revenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Total revenue
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="betting-card">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {adminData.recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transaction.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="betting-card">
        <h3 className="text-xl font-semibold text-white mb-4">Suspicious Activities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {adminData.suspiciousActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {activity.activity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getSeverityColor(activity.severity)}>
                      {activity.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="btn-secondary text-sm">
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderKYC = () => (
    <div className="space-y-6">
      <div className="betting-card">
        <h3 className="text-xl font-semibold text-white mb-4">KYC Verification Requests</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {adminData.kycRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {request.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {request.documents.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {request.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getStatusColor(request.status)}>
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="btn-primary text-sm">
                      Approve
                    </button>
                    <button className="btn-secondary text-sm">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="betting-card">
      <h3 className="text-xl font-semibold text-white mb-6">Admin Settings</h3>
      <form className="space-y-6">
        <div>
          <label className="form-label">Site Maintenance Mode</label>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded"
            />
            <span className="ml-2 text-gray-300">Enable maintenance mode</span>
          </div>
        </div>

        <div>
          <label className="form-label">Maximum Bet Limit</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter maximum bet amount"
          />
        </div>

        <div>
          <label className="form-label">Minimum Withdrawal Amount</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter minimum withdrawal amount"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Save Settings
        </button>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor and manage your betting platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-8 bg-gray-800 rounded-lg p-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-chart-pie mr-2"></i>
          Overview
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'security' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-shield-alt mr-2"></i>
          Security
        </button>
        <button
          onClick={() => setActiveTab('kyc')}
          className={'px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
            (activeTab === 'kyc' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')}
        >
          <i className="fas fa-user-check mr-2"></i>
          KYC Verification
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
      {activeTab === 'security' && renderSecurity()}
      {activeTab === 'kyc' && renderKYC()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default AdminDashboard;