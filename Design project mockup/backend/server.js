const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { connectDB, sequelize } = require('./config/db');
require('./models/User');
require('./models/Turf');
require('./models/Booking');
require('./models/Payment');
require('./models/PasswordReset');

const authRoutes = require('./routes/authRoutes');
const turfRoutes = require('./routes/turfRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api', profileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// If port 5000 is already taken (common when another instance is running),
// gracefully fall back to the next free port so `npm start` doesn't crash.
const basePort = Number.parseInt(process.env.PORT || '5000', 10);
const maxPortAttempts = 10;

async function start() {
  const startPort = Number.isNaN(basePort) ? 5000 : basePort;

  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('PostgreSQL Models Synced');

  for (let attempt = 0; attempt < maxPortAttempts; attempt += 1) {
    const portToTry = startPort + attempt;

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
    });
    app.set('io', io);

    try {
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(portToTry, resolve);
      });

      console.log(`Server running on port ${portToTry}`);
      return;
    } catch (err) {
      // Ensure we don't keep resources around if the port is already taken.
      try {
        io.close();
      } catch (_) {
        // ignore
      }
      try {
        server.close();
      } catch (_) {
        // ignore
      }

      if (err?.code === 'EADDRINUSE') {
        console.warn(`Port in use. Retrying on port ${portToTry + 1}...`);
        continue;
      }

      throw err;
    }
  }

  throw new Error(
    `Failed to start server; ports ${startPort}..${startPort + maxPortAttempts - 1} are all in use`
  );
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Restart trigger
