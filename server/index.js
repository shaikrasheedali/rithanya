const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

const apiRouter = require('./routers');
const errorHandler = require('./middlewares/errorHandler');
const { autoMigrate } = require('./config/dbMigrator');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Optimization Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow CDNs, fonts, and inline styles for full aesthetic fidelity
    crossOriginEmbedderPolicy: false
  })
);

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' })); // High limit for camera photo consent capture (longblob)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded assets
const uploadsDir = path.join(__dirname, '../client/public/assets/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/assets/uploads', express.static(uploadsDir));

// Mount Master API Router
app.use('/api', apiRouter);

// Unified Frontend Serving: Serve built React client from client/dist on the exact same port
const distPath = path.join(__dirname, '../client/dist');
const publicPath = path.join(__dirname, '../client/public');

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

if (fs.existsSync(distPath)) {
  console.log(`[Unified Port] Serving React frontend production bundle from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for HTML5 History routing
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If frontend is not built yet, display a helpful status message for dev
  app.get('/', (req, res) => {
    res.json({
      message: 'Rithanya Hospital API Server is Running.',
      healthCheck: '/api/health',
      docs: 'API routes mounted under /api',
      note: 'Run `npm run build` in root to build the React 19 frontend bundle for unified serving.'
    });
  });
}

// Centralized Error Handling
app.use(errorHandler);

// Start server after auto-migration check
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await autoMigrate();
    }

    const server = app.listen(PORT, () => {
      console.log(`\n🏥 =======================================================`);
      console.log(`   Rithanya Hospital & Daycare Transfusion Centre Platform`);
      console.log(`   Unified Server running at: http://localhost:${PORT}`);
      console.log(`   Health Check endpoint:     http://localhost:${PORT}/api/health`);
      console.log(`   Environment:               ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================\n`);
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
