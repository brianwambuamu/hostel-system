// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Production configuration optimized for high-concurrency connections
    const dbOptions = {
      maxPoolSize: 50,             // Maintain up to 50 concurrent socket connections
      minPoolSize: 10,             // Keep at least 10 connections open at all times
      socketTimeoutMS: 30000,      // Close sockets after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000 // Fail quickly if the primary database crashes
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, dbOptions);
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    
    // Ensure all compound and unique indexes are built before traffic hits
    conn.connection.on('index', (error) => {
      if (error) console.error('❌ MongoDB Index Build Error:', error);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    process.exit(1); // Kill process immediately so process manager (PM2/Docker) can restart it
  }
};

/**
 * Global Database Transaction Helper
 * Safeguards multi-document operations (e.g., room transfers, booking releases)
 * @param {Function} transactionWork - Async logic containing database operations
 */
const runInTransaction = async (transactionWork) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await transactionWork(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    console.error('🚨 Transaction Aborted due to processing error:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { connectDB, runInTransaction };