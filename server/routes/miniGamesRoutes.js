const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../config/jwtConfig');
const miniGamesController = require('../controllers/miniGamesController');

// Mini games routes
router.get('/games', authenticateToken, miniGamesController.getGames);
router.post('/aviator/start', authenticateToken, miniGamesController.startAviator);
router.post('/aviator/cashout', authenticateToken, miniGamesController.cashoutAviator);
router.get('/history', authenticateToken, miniGamesController.getGameHistory);

// Add minigame_sessions table if it doesn't exist
const { run } = require('../config/db');
run(`
  CREATE TABLE IF NOT EXISTS minigame_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_type TEXT NOT NULL,
    bet_amount REAL NOT NULL,
    crash_point REAL,
    cashout_multiplier REAL,
    win_amount REAL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`).catch(err => console.error('Error creating minigame_sessions table:', err));

// Add minigame_history table if it doesn't exist
run(`
  CREATE TABLE IF NOT EXISTS minigame_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_type TEXT NOT NULL,
    crash_point REAL NOT NULL,
    total_bets INTEGER NOT NULL,
    total_wins INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating minigame_history table:', err));

// Add minigame_stats table if it doesn't exist
run(`
  CREATE TABLE IF NOT EXISTS minigame_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_type TEXT NOT NULL,
    total_bets INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_wagered REAL DEFAULT 0,
    total_won REAL DEFAULT 0,
    highest_multiplier REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, game_type)
  )
`).catch(err => console.error('Error creating minigame_stats table:', err));

// Add triggers to update stats
run(`
  CREATE TRIGGER IF NOT EXISTS update_minigame_stats_after_win
  AFTER UPDATE ON minigame_sessions
  WHEN NEW.status = 'completed'
  BEGIN
    INSERT INTO minigame_stats (user_id, game_type, total_bets, total_wins, total_wagered, total_won, highest_multiplier)
    VALUES (
      NEW.user_id,
      NEW.game_type,
      1,
      1,
      NEW.bet_amount,
      NEW.win_amount,
      NEW.cashout_multiplier
    )
    ON CONFLICT(user_id, game_type) DO UPDATE SET
      total_bets = total_bets + 1,
      total_wins = total_wins + 1,
      total_wagered = total_wagered + NEW.bet_amount,
      total_won = total_won + NEW.win_amount,
      highest_multiplier = MAX(highest_multiplier, NEW.cashout_multiplier),
      updated_at = CURRENT_TIMESTAMP;
  END;
`).catch(err => console.error('Error creating win trigger:', err));

run(`
  CREATE TRIGGER IF NOT EXISTS update_minigame_stats_after_loss
  AFTER UPDATE ON minigame_sessions
  WHEN NEW.status = 'crashed'
  BEGIN
    INSERT INTO minigame_stats (user_id, game_type, total_bets, total_wagered)
    VALUES (
      NEW.user_id,
      NEW.game_type,
      1,
      NEW.bet_amount
    )
    ON CONFLICT(user_id, game_type) DO UPDATE SET
      total_bets = total_bets + 1,
      total_wagered = total_wagered + NEW.bet_amount,
      updated_at = CURRENT_TIMESTAMP;
  END;
`).catch(err => console.error('Error creating loss trigger:', err));

run(`
  CREATE TRIGGER IF NOT EXISTS update_game_history
  AFTER UPDATE ON minigame_sessions
  WHEN NEW.status IN ('completed', 'crashed')
  BEGIN
    INSERT INTO minigame_history (
      game_type,
      crash_point,
      total_bets,
      total_wins
    )
    VALUES (
      NEW.game_type,
      NEW.crash_point,
      (SELECT COUNT(*) FROM minigame_sessions WHERE id = NEW.id),
      (SELECT COUNT(*) FROM minigame_sessions WHERE id = NEW.id AND status = 'completed')
    );
  END;
`).catch(err => console.error('Error creating history trigger:', err));

module.exports = router;