function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Specific handling for Database connection and configuration errors
  if (err.code === 'P1001') {
    statusCode = 503;
    message = 'Database connection failed: Unable to reach database server. Please check DB_HOST, DB_PORT, and network connectivity.';
  } else if (err.code === 'P1003') {
    statusCode = 503;
    message = 'Database does not exist on the database server. Please verify DB_NAME in hosting environment.';
  } else if (err.code === 'P1000') {
    statusCode = 503;
    message = 'Database authentication failed. Please check DB_USER and DB_PASSWORD credentials.';
  } else if (err.name === 'PrismaClientInitializationError') {
    statusCode = 503;
    message = 'Database initialization failed: ' + (err.message || 'Check database environment variables.');
  }

  return res.status(statusCode).json({
    success: false,
    message,
    code: err.code || null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
