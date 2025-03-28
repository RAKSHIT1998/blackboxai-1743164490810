const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../config/jwtConfig');
const casinoController = require('../controllers/casinoController');

// Casino game routes
router.get('/games', authenticateToken, casinoController.getGames);
router.post('/launch', authenticateToken, casinoController.launchGame);
router.post('/result', casinoController.handleGameResult);

// Add game session table if it doesn't exist
const { run } = require('../config/db');
run(`
  CREATE TABLE IF NOT EXISTS game_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    result TEXT,
    win_amount REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`).catch(err => console.error('Error creating game_sessions table:', err));

module.exports = router;