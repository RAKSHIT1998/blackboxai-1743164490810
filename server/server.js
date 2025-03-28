require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { setupDatabase } = require('./config/db');
const logger = require('./config/logger');
const { verifyToken } = require('./config/jwtConfig');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const betRoutes = require('./routes/betRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const casinoRoutes = require('./routes/casinoRoutes');
const sportsRoutes = require('./routes/sportsRoutes');
const miniGamesRoutes = require('./routes/miniGamesRoutes');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/casino', casinoRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/mini-games', miniGamesRoutes);

// Make io instance available to routes
app.set('io', io);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('New client connected');

  // Handle user authentication
  socket.on('authenticate', (token) => {
    try {
      const user = verifyToken(token);
      socket.userId = user.id;
      socket.join(`user-${user.id}`);
      logger.info(`User ${user.id} authenticated`);
    } catch (error) {
      logger.error('Socket authentication error:', error);
    }
  });

  // Sports betting events
  socket.on('subscribe_odds', (data) => {
    socket.join(`odds_${data.sportId}`);
    logger.info(`Client subscribed to odds updates for sport ${data.sportId}`);
  });

  socket.on('subscribe_match', (matchId) => {
    socket.join(`match-${matchId}`);
    logger.info(`Client subscribed to match ${matchId}`);
  });

  // Casino events
  socket.on('join_game', (gameId) => {
    socket.join(`game-${gameId}`);
    logger.info(`Client joined casino game ${gameId}`);
  });

  socket.on('leave_game', (gameId) => {
    socket.leave(`game-${gameId}`);
    logger.info(`Client left casino game ${gameId}`);
  });

  // Mini games events
  socket.on('join_minigame', (sessionId) => {
    socket.join(`game-${sessionId}`);
    logger.info(`Client joined mini game session ${sessionId}`);
  });

  socket.on('leave_minigame', (sessionId) => {
    socket.leave(`game-${sessionId}`);
    logger.info(`Client left mini game session ${sessionId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
    
    // Clean up user-specific rooms if authenticated
    if (socket.userId) {
      socket.leave(`user-${socket.userId}`);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred'
  });
});

// Initialize database
setupDatabase()
  .then(() => {
    logger.info('Database initialized successfully');
    
    // Start server
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});