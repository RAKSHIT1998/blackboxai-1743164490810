import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Casino = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock casino games data - will be replaced with API data
  const categories = [
    { id: 'all', name: 'All Games', icon: 'gamepad' },
    { id: 'slots', name: 'Slots', icon: 'dice' },
    { id: 'table', name: 'Table Games', icon: 'table' },
    { id: 'live', name: 'Live Casino', icon: 'video' },
    { id: 'poker', name: 'Poker', icon: 'crown' }
  ];

  const games = [
    {
      id: 1,
      name: 'Blackjack Live',
      provider: 'Evolution Gaming',
      category: 'live',
      image: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg',
      players: 234,
      minBet: 5,
      maxBet: 1000
    },
    {
      id: 2,
      name: 'Mega Fortune',
      provider: 'NetEnt',
      category: 'slots',
      image: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg',
      players: 456,
      minBet: 0.20,
      maxBet: 100
    },
    {
      id: 3,
      name: 'Roulette Master',
      provider: 'Pragmatic Play',
      category: 'table',
      image: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg',
      players: 189,
      minBet: 1,
      maxBet: 500
    },
    {
      id: 4,
      name: "Texas Hold'em",
      provider: 'Evolution Gaming',
      category: 'poker',
      image: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg',
      players: 678,
      minBet: 10,
      maxBet: 2000
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
            backgroundImage: 'url("https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg")',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Bets Wizz Casino
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Experience the thrill of live dealers and premium casino games
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Start Playing
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>Min: ${game.minBet}</span>
                <span>Max: ${game.maxBet}</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary flex-1">
                  Play Now
                </button>
                <button className="btn-secondary w-12 flex items-center justify-center">
                  <i className="fas fa-info"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promotions Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="betting-card bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                Welcome Bonus
              </h3>
              <p className="text-indigo-200 mb-4">
                Get 100% bonus up to $500 on your first deposit
              </p>
              <button className="btn-secondary bg-white text-indigo-600 hover:bg-indigo-50">
                Claim Now
              </button>
            </div>
            <div className="text-6xl text-white opacity-50">
              <i className="fas fa-gift"></i>
            </div>
          </div>
        </div>

        <div className="betting-card bg-gradient-to-r from-green-600 to-teal-600">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                Weekly Cashback
              </h3>
              <p className="text-green-200 mb-4">
                Get 10% cashback on all your losses every week
              </p>
              <button className="btn-secondary bg-white text-green-600 hover:bg-green-50">
                Learn More
              </button>
            </div>
            <div className="text-6xl text-white opacity-50">
              <i className="fas fa-undo"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Casino;