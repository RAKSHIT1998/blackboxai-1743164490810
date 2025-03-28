const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('./logger');

// Create database connection
const db = new sqlite3.Database(
  path.join(__dirname, '../data/betswizz.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      logger.error('Error connecting to database:', err);
      throw err;
    }
    logger.info('Connected to SQLite database');
  }
);

// SQL statements for creating tables
const TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      balance REAL DEFAULT 0,
      google_id TEXT,
      wallet_address TEXT,
      role TEXT DEFAULT 'user',
      is_verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  bets: `
    CREATE TABLE IF NOT EXISTS bets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_type TEXT NOT NULL,
      bet_amount REAL NOT NULL,
      odds REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      result TEXT,
      winnings REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `,
  
  transactions: `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `,
  
  kyc_verifications: `
    CREATE TABLE IF NOT EXISTS kyc_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      document_type TEXT NOT NULL,
      document_url TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      verified_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `,
  
  suspicious_activities: `
    CREATE TABLE IF NOT EXISTS suspicious_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      activity_type TEXT NOT NULL,
      description TEXT,
      severity TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `
};

// Function to initialize the database schema
const setupDatabase = async () => {
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        logger.error('Error enabling foreign keys:', err);
        reject(err);
        return;
      }

      // Create tables
      const tablePromises = Object.entries(TABLES).map(([tableName, schema]) => {
        return new Promise((resolveTable, rejectTable) => {
          db.run(schema, (err) => {
            if (err) {
              logger.error(`Error creating ${tableName} table:`, err);
              rejectTable(err);
              return;
            }
            logger.info(`${tableName} table created or already exists`);
            resolveTable();
          });
        });
      });

      // Create admin user if it doesn't exist
      const createAdminUser = new Promise((resolveAdmin, rejectAdmin) => {
        const adminEmail = 'Rakshit@9858';
        const adminPassword = '$2a$10$YourHashedPasswordHere'; // Pre-hashed password: 9858224000

        db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
          if (err) {
            rejectAdmin(err);
            return;
          }

          if (!row) {
            db.run(
              'INSERT INTO users (email, password_hash, name, role, is_verified) VALUES (?, ?, ?, ?, ?)',
              [adminEmail, adminPassword, 'Admin User', 'admin', 1],
              (err) => {
                if (err) {
                  rejectAdmin(err);
                  return;
                }
                logger.info('Admin user created');
                resolveAdmin();
              }
            );
          } else {
            resolveAdmin();
          }
        });
      });

      // Wait for all tables and admin user to be created
      Promise.all([...tablePromises, createAdminUser])
        .then(() => {
          logger.info('Database setup completed');
          resolve();
        })
        .catch((err) => {
          logger.error('Database setup failed:', err);
          reject(err);
        });
    });
  });
};

// Helper function to run SQL queries
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        logger.error('Query error:', err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

// Helper function to run SQL queries that modify data
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        logger.error('Query error:', err);
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = {
  db,
  setupDatabase,
  query,
  run
};