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

// Serve uploaded assets with automatic MySQL database rehydration
const uploadsDir = path.join(__dirname, '../client/public/assets/uploads');
const distUploadsDir = path.join(__dirname, '../client/dist/assets/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Static disk serving
app.use('/assets/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(uploadsDir));
if (fs.existsSync(distUploadsDir)) {
  app.use('/assets/uploads', express.static(distUploadsDir));
  app.use('/uploads', express.static(distUploadsDir));
}

// 2. Resilient Database Rehydration Route: Serves assets stored in MySQL if disk was reset
const prismaClient = require('./config/db');
app.get(['/assets/uploads/:filename', '/uploads/:filename'], async (req, res, next) => {
  const filename = path.basename(req.params.filename);
  try {
    const asset = await prismaClient.mediaAsset.findFirst({
      where: {
        OR: [
          { filename },
          { url: { endsWith: filename } }
        ]
      }
    });

    if (asset && asset.fileData) {
      const buffer = Buffer.from(asset.fileData, 'base64');
      // Rehydrate local disk cache
      try {
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      } catch (_) {}

      res.setHeader('Content-Type', asset.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      return res.send(buffer);
    }
  } catch (err) {
    console.warn(`[Asset Rehydrate] Notice for ${filename}:`, err.message);
  }
  next();
});

// Intelligent Caching: Allow fast HTTP caching for public catalog GET requests; keep no-store for auth & admin
const PUBLIC_CATALOG_ROUTES = ['/services', '/treatments', '/specialists', '/products', '/gallery', '/blogs', '/settings'];

app.use('/api', (req, res, next) => {
  const isPublicCatalogGet = req.method === 'GET' && PUBLIC_CATALOG_ROUTES.some((r) => req.path.startsWith(r));

  if (isPublicCatalogGet) {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  } else {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Mount Master API Router
app.use('/api', apiRouter);

// Alias root /upload directly to media upload for direct client compatibility
app.use('/upload', (req, res, next) => {
  req.url = '/media/upload';
  apiRouter(req, res, next);
});

// Explicit JSON 404 handler for any unhandled /api/* routes so they NEVER return HTML
app.all('/api/*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Unified Frontend Serving: Serve built React client from client/dist on the exact same port
const distPath = path.join(__dirname, '../client/dist');
const publicPath = path.join(__dirname, '../client/public');

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

if (fs.existsSync(distPath)) {
  console.log(`[Unified Port] Serving React frontend production bundle from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for HTML5 History routing (GET only, ignore /api and /assets)
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/assets')) {
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
