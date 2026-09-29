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

// SVG Fallback Generator for self-healing asset delivery
function generateFallbackSvg(filename = 'asset') {
  const cleanName = path.basename(filename).replace(/[._-]/g, ' ').slice(0, 30);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c50e1f"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bgGrad)"/>
  <rect x="20" y="20" width="560" height="360" rx="12" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="300" cy="165" r="48" fill="url(#accentGrad)" opacity="0.9"/>
  <!-- Hospital Cross Icon -->
  <path d="M292 135 H308 V157 H330 V173 H308 V195 H292 V173 H270 V157 H292 Z" fill="#ffffff"/>
  <text x="300" y="245" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" text-anchor="middle" letter-spacing="1">RITHANYA HOSPITAL</text>
  <text x="300" y="275" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" text-anchor="middle">Clinical Media Asset</text>
  <text x="300" y="305" fill="#64748b" font-family="monospace" font-size="11" text-anchor="middle">${cleanName}</text>
</svg>`;
}

// 2. Resilient Database Rehydration Route: Serves assets stored in MySQL or self-heals with fallback
const prismaClient = require('./config/db');
app.get(['/assets/uploads/:filename', '/uploads/:filename'], async (req, res) => {
  const filename = path.basename(req.params.filename);

  // Check physical disk first
  const publicPath = path.join(uploadsDir, filename);
  const distFile = path.join(distUploadsDir, filename);
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }
  if (fs.existsSync(distFile)) {
    return res.sendFile(distFile);
  }

  try {
    const asset = await prismaClient.mediaAsset.findFirst({
      where: {
        OR: [
          { filename },
          { url: { endsWith: filename } }
        ]
      }
    });

    if (asset && asset.fileData && asset.fileData.trim().length > 20) {
      const buffer = Buffer.from(asset.fileData, 'base64');
      // Rehydrate local disk cache
      try {
        fs.writeFileSync(publicPath, buffer);
      } catch (_) {}

      res.setHeader('Content-Type', asset.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      return res.status(200).send(buffer);
    }
  } catch (err) {
    console.warn(`[Asset Rehydrate] Safe catch for ${filename}:`, err.message);
  }

  // Graceful Self-Healing Fallback: Try /image.png first, then SVG fallback (200 OK) so frontend never breaks with 404/500
  const fallbackImagePublic = path.join(__dirname, '../client/public/image.png');
  const fallbackImageDist = path.join(__dirname, '../client/dist/image.png');
  if (fs.existsSync(fallbackImagePublic)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    return res.status(200).sendFile(fallbackImagePublic);
  }
  if (fs.existsSync(fallbackImageDist)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    return res.status(200).sendFile(fallbackImageDist);
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  return res.status(200).send(generateFallbackSvg(filename));
});

// Intelligent Caching: Allow fast HTTP caching for public catalog GET requests; keep no-store for auth & admin
const PUBLIC_CATALOG_ROUTES = ['/services', '/treatments', '/specialists', '/products', '/gallery', '/blogs', '/settings'];

app.use('/api', (req, res, next) => {
  const isAuthOrAdmin = req.headers.authorization || req.headers['x-admin-request'] || req.query._t;
  const isPublicCatalogGet = !isAuthOrAdmin && req.method === 'GET' && PUBLIC_CATALOG_ROUTES.some((r) => req.path.startsWith(r));

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

// Strict Block Middleware: Intercept bot probing, php/asp scans, and sensitive paths before SPA catch-all
const BLOCKED_PATTERNS = [
  /\.(php|asp|aspx|jsp|cgi|pl|env|git|yml|yaml|sql|bak|config|ini|sh|bash)$/i,
  /^\/(wp-admin|wp-includes|wp-content|xmlrpc|phpmyadmin|pma|adminer|cgi-bin|\.env|\.git|\.well-known\/traffic-advice)/i
];

app.use((req, res, next) => {
  const urlPath = req.path;
  const isBlocked = BLOCKED_PATTERNS.some((pattern) => pattern.test(urlPath) || pattern.test(req.originalUrl));
  if (isBlocked) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      code: 'SECURITY_BLOCKED',
      path: urlPath
    });
  }
  next();
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

  // SPA fallback for HTML5 History routing (GET only, ignore /api, /assets, and /uploads)
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/assets') || req.originalUrl.startsWith('/uploads')) {
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
      try {
        const { sanitizeDatabaseAssets } = require('./utils/sanitizeAssets');
        await sanitizeDatabaseAssets();
      } catch (sanErr) {
        console.warn('[Asset Sanitizer] Boot warning:', sanErr.message);
      }
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
