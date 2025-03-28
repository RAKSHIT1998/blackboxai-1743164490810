import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <i className="fas fa-dice text-indigo-500 text-2xl mr-2"></i>
              <span className="text-white text-xl font-bold">Bets Wizz</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your premier destination for online betting, featuring sports betting, casino games, 
              and exciting mini-games. Play responsibly and enjoy the thrill of the game.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sports" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Sports Betting
                </Link>
              </li>
              <li>
                <Link to="/casino" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Casino Games
                </Link>
              </li>
              <li>
                <Link to="/mini-games" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Mini Games
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors duration-200">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/responsible-gambling" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Responsible Gambling
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Bets Wizz. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <img src="https://via.placeholder.com/40" alt="Payment Method" className="h-6" />
              <img src="https://via.placeholder.com/40" alt="Payment Method" className="h-6" />
              <img src="https://via.placeholder.com/40" alt="Payment Method" className="h-6" />
              <img src="https://via.placeholder.com/40" alt="Payment Method" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;