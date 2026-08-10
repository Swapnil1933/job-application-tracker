const mongoose = require('mongoose');
const config = require('./env');
const seedData = require('../seed/seedData');

const connectDB = async () => {
  let connected = false;

  // 1. Try configured MONGO_URI
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    connected = true;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB URI (${config.MONGO_URI}) failed: ${error.message}`);
  }

  // 2. Fallback to 127.0.0.1 if localhost was used
  if (!connected && config.MONGO_URI.includes('localhost')) {
    const altUri = config.MONGO_URI.replace('localhost', '127.0.0.1');
    try {
      console.log(`🔄 Attempting fallback URI: ${altUri}`);
      const conn = await mongoose.connect(altUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Connected via 127.0.0.1: ${conn.connection.host}`);
      connected = true;
    } catch (altErr) {
      console.warn(`⚠️ Fallback MongoDB URI (${altUri}) failed: ${altErr.message}`);
    }
  }

  // 3. Fallback to MongoMemoryServer
  if (!connected) {
    try {
      console.log(`🚀 Starting in-memory MongoDB fallback server...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      connected = true;

      // Seed data into memory server
      console.log(`🌱 Seeding demo data into memory database...`);
      await seedData(false);
    } catch (memError) {
      console.error(`❌ MongoMemoryServer Error: ${memError.message}`);
    }
  }

  if (!connected) {
    throw new Error('❌ Unable to establish a database connection to MongoDB or In-Memory MongoDB Server.');
  }

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });
};

module.exports = connectDB;

