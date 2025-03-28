import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Mock featured games data - will be replaced with API data
  const featuredGames = [
    {
      id: 1,
      title: "Premier League",
      type: "sports",
      image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
      description: "Bet on the biggest football matches"
    },
    {
      id: 2,
      title: "Blackjack Live",
      type: "casino",
      image: "https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg",
      description: "Play live blackjack with professional dealers"
    },
    {
      id: 3,
      title: "Aviator",
      type: "mini-games",
      image: "https://images.pexels.com/photos/1655028/pexels-photo-1655028.jpeg",
      description: "Experience the thrill of our popular crash game"
    }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg')",
            filter: "brightness(0.3)"
          }}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Bets Wizz
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your premier destination for sports betting, casino games, and exciting mini-games.
            Join now and experience the thrill!
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/sports" className="btn-secondary text-lg px-8 py-3">
              View Odds
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredGames.map((game) => (
            <div key={game.id} className="game-card group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <Link 
                  to={`/${game.type}`}
                  className="inline-block btn-primary"
                >
                  Play Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="stats-card text-center">
            <i className="fas fa-shield-alt text-4xl text-indigo-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Platform</h3>
            <p className="text-gray-400">
              Advanced encryption and secure payment methods to protect your data and funds
            </p>
          </div>
          <div className="stats-card text-center">
            <i className="fas fa-bolt text-4xl text-indigo-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Payouts</h3>
            <p className="text-gray-400">
              Quick and hassle-free withdrawals with multiple payment options
            </p>
          </div>
          <div className="stats-card text-center">
            <i className="fas fa-headset text-4xl text-indigo-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
            <p className="text-gray-400">
              Professional support team ready to assist you anytime
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Betting?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of players and experience the best in online betting
        </p>
        <Link 
          to="/register" 
          className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-md hover:bg-indigo-50 transition-colors duration-200"
        >
          Create Account
        </Link>
      </section>
    </div>
  );
};

export default Home;