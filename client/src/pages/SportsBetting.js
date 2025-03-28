import React, { useState, useEffect } from 'react';

const SportsBetting = () => {
  const [selectedSport, setSelectedSport] = useState('football');
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [betSlip, setBetSlip] = useState([]);

  // Mock sports data - will be replaced with API data
  const sports = [
    { id: 'football', name: 'Football', icon: 'futbol' },
    { id: 'basketball', name: 'Basketball', icon: 'basketball-ball' },
    { id: 'tennis', name: 'Tennis', icon: 'table-tennis' },
    { id: 'cricket', name: 'Cricket', icon: 'cricket' },
    { id: 'baseball', name: 'Baseball', icon: 'baseball-ball' }
  ];

  // Mock matches data - will be replaced with API data
  const mockMatches = {
    football: [
      {
        id: 1,
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        time: '19:45',
        date: '2024-02-20',
        odds: {
          home: 2.10,
          draw: 3.40,
          away: 3.20
        }
      },
      {
        id: 2,
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        time: '20:00',
        date: '2024-02-20',
        odds: {
          home: 1.90,
          draw: 3.50,
          away: 3.80
        }
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setMatches(mockMatches[selectedSport] || []);
      setIsLoading(false);
    }, 1000);
  }, [selectedSport]);

  const addToBetSlip = (match, betType, odds) => {
    const bet = {
      id: match.id + '-' + betType,
      match: match.homeTeam + ' vs ' + match.awayTeam,
      type: betType,
      odds: odds,
      stake: 0
    };

    setBetSlip(prev => {
      const exists = prev.find(item => item.id === bet.id);
      if (exists) return prev;
      return [...prev, bet];
    });
  };

  const removeBet = (betId) => {
    setBetSlip(prev => prev.filter(bet => bet.id !== betId));
  };

  const updateStake = (betId, stake) => {
    setBetSlip(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, stake: parseFloat(stake) || 0 } : bet
    ));
  };

  const calculateTotalStake = () => {
    return betSlip.reduce((total, bet) => total + bet.stake, 0);
  };

  const calculatePotentialWinnings = () => {
    return betSlip.reduce((total, bet) => total + (bet.stake * bet.odds), 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sports Navigation */}
      <div className="flex overflow-x-auto mb-8 bg-gray-800 rounded-lg p-2">
        {sports.map(sport => (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={'flex items-center px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
              (selectedSport === sport.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700')
            }
          >
            <i className={'fas fa-' + sport.icon + ' mr-2'}></i>
            {sport.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6">Available Matches</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No matches available for this sport
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(match => (
                <div key={match.id} className="betting-card">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {match.date} {match.time}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      <i className="fas fa-clock mr-1"></i> Match Time
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => addToBetSlip(match, 'home', match.odds.home)}
                      className="btn-secondary text-center"
                    >
                      <div className="text-sm mb-1">Home</div>
                      <div className="font-semibold">{match.odds.home}</div>
                    </button>
                    <button
                      onClick={() => addToBetSlip(match, 'draw', match.odds.draw)}
                      className="btn-secondary text-center"
                    >
                      <div className="text-sm mb-1">Draw</div>
                      <div className="font-semibold">{match.odds.draw}</div>
                    </button>
                    <button
                      onClick={() => addToBetSlip(match, 'away', match.odds.away)}
                      className="btn-secondary text-center"
                    >
                      <div className="text-sm mb-1">Away</div>
                      <div className="font-semibold">{match.odds.away}</div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bet Slip */}
        <div className="lg:col-span-1">
          <div className="betting-card sticky top-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Bet Slip ({betSlip.length})
            </h2>
            
            {betSlip.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <i className="fas fa-ticket-alt text-4xl mb-2"></i>
                <p>Your bet slip is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {betSlip.map(bet => (
                    <div key={bet.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{bet.match}</h4>
                          <p className="text-sm text-gray-400">
                            {bet.type.charAt(0).toUpperCase() + bet.type.slice(1)} @ {bet.odds}
                          </p>
                        </div>
                        <button
                          onClick={() => removeBet(bet.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter stake"
                        className="form-input mt-2"
                        value={bet.stake || ''}
                        onChange={(e) => updateStake(bet.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-gray-400 mb-2">
                    <span>Total Stake:</span>
                    <span>${calculateTotalStake().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold mb-4">
                    <span>Potential Winnings:</span>
                    <span>${calculatePotentialWinnings().toFixed(2)}</span>
                  </div>
                  <button className="btn-primary w-full">
                    Place Bet
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsBetting;