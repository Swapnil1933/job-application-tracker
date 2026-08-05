const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
  // Connect to database
  await connectDB();

  // Start server
  const server = app.listen(config.PORT, () => {
    console.log(`🚀 Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
