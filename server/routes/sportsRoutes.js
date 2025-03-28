const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../config/jwtConfig');
const sportsController = require('../controllers/sportsController');

// Sports betting routes
router.get('/sports', authenticateToken, sportsController.getSports);
router.get('/matches/live', authenticateToken, sportsController.getLiveMatches);
router.get('/matches/upcoming', authenticateToken, sportsController.getUpcomingMatches);
router.get('/matches/:matchId', authenticateToken, sportsController.getMatchDetails);
router.post('/bet', authenticateToken, sportsController.placeBet);
router.post('/odds/subscribe/:matchId', authenticateToken, sportsController.subscribeToOdds);

// Add sports_matches table if it doesn't exist
const { run } = require('../config/db');
run(`
  CREATE TABLE IF NOT EXISTS sports_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id TEXT UNIQUE NOT NULL,
    sport_id TEXT NOT NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    status TEXT DEFAULT 'scheduled',
    score_home INTEGER,
    score_away INTEGER,
    odds_home REAL,
    odds_draw REAL,
    odds_away REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating sports_matches table:', err));

// Add sports_bets table if it doesn't exist
run(`
  CREATE TABLE IF NOT EXISTS sports_bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    match_id TEXT NOT NULL,
    bet_type TEXT NOT NULL,
    stake REAL NOT NULL,
    odds REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    result TEXT,
    winnings REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (match_id) REFERENCES sports_matches (match_id)
  )
`).catch(err => console.error('Error creating sports_bets table:', err));

module.exports = router;