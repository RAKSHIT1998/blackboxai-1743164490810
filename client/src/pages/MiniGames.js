import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MiniGames = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock mini-games data - will be replaced with API data
  const categories = [
    { id: 'all', name: 'All Games', icon: 'gamepad' },
    { id: 'crash', name: 'Crash Games', icon: 'chart-line' },
    { id: 'instant', name: 'Instant Win', icon: 'bolt' },
    { id: 'dice', name: 'Dice Games', icon: 'dice' },
    { id: 'cards', name: 'Card Games', icon: 'playing-cards' }
  ];

  const games = [
    {
      id: 1,
      name: 'Aviator',
      category: 'crash',
      provider: 'Spribe',
      image: 'https://images.pexels.com/photos/1655028/pexels-photo-1655028.jpeg',
      players: 1245,
      description: 'Watch the plane fly and cash out before it crashes!',
      maxWin: '10,000x'
    },
    {
      id: 2,
      name: 'Dice Duel',
      category: 'dice',
      provider: 'Hacksaw Gaming',
      image: 'https://images.pexels.com/photos/1655028/pexels-photo-1655028.jpeg',
      players: 856,
      description: 'Roll the dice and multiply your wins!',
      maxWin: '1,000x'
    },
    {
      id: 3,
      name: 'Lucky Cards',
      category: 'cards',
      provider: 'Evolution Gaming',
      image: 'https://images.pexels.com/photos/1655028/pexels-photo-1655028.jpeg',
      players: 567,
      description: 'Pick your cards and win instant prizes!',
      maxWin: '500x'
    },
    {
      id: 4,
      name: 'Crash Rocket',
      category: 'crash',
      provider: 'Pragmatic Play',
      image: 'https://images.pexels.com/photos/1655028/pexels-photo-1655028.jpeg',
      players: 989,
      description: 'Ride the rocket to massive multipliers!',
      maxWin: '1,000x'
    }
  ];

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(game => game.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-12 h-64">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1655028/pexels-photo-1655028.jpeg")',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mini Games
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Quick games with instant results and massive multipliers
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Play Now
          </Link>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="flex overflow-x-auto mb-8 bg-gray-800 rounded-lg p-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={'flex items-center px-4 py-2 rounded-md mr-2 transition-colors duration-200 ' + 
              (selectedCategory === category.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700')
            }
          >
            <i className={'fas fa-' + category.icon + ' mr-2'}></i>
            {category.name}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map(game => (
          <div key={game.id} className="game-card group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={game.image} 
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                <i className="fas fa-users mr-1"></i> {game.players}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                <span className="text-sm text-gray-400">{game.provider}</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Max Win:</span>
                <span className="text-green-400 font-semibold">{game.maxWin}</span>
              </div>
              
              <button className="btn-primary w-full">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="betting-card text-center">
          <div className="text-4xl text-indigo-500 mb-4">
            <i className="fas fa-bolt"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Instant Results
          </h3>
          <p className="text-gray-400">
            No waiting - get your results instantly and play again
          </p>
        </div>

        <div className="betting-card text-center">
          <div className="text-4xl text-indigo-500 mb-4">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Massive Multipliers
          </h3>
          <p className="text-gray-400">
            Win up to 10,000x your stake with our exciting multipliers
          </p>
        </div>

        <div className="betting-card text-center">
          <div className="text-4xl text-indigo-500 mb-4">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Provably Fair
          </h3>
          <p className="text-gray-400">
            All games are verified and provably fair for your peace of mind
          </p>
        </div>
      </div>

      {/* How to Play Section */}
      <div className="mt-12 betting-card">
        <h2 className="text-2xl font-bold text-white mb-6">How to Play</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Choose Game</h3>
            <p className="text-gray-400">
              Select from our wide variety of instant win games
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Place Bet</h3>
            <p className="text-gray-400">
              Set your stake and additional game parameters
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Win Big</h3>
            <p className="text-gray-400">
              Get instant results and collect your winnings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGames;