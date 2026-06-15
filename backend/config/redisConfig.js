// backend/config/redisConfig.js
const { createClient } = require('redis');

// Initialize the Redis Client pointing to your local instance or cloud cluster
const RedisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    connectTimeout: 10000, // 10 seconds timeout limit
    // Reconnect Strategy to recover from dropped connections automatically
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('🚨 Redis critical: Maximum reconnection retries reached.');
        return new Error('Redis connection lost permanently.');
      }
      // Linearly back off retry delays (e.g., 500ms, 1000ms, 1500ms...)
      return Math.min(retries * 500, 4000);
    }
  }
});

// Event listeners to observe system connectivity states
RedisClient.on('connect', () => console.log('🟢 Redis Client Connecting...'));
RedisClient.on('ready', () => console.log('🟢 Redis Engine Online and Memory Available'));
RedisClient.on('error', (err) => console.error('❌ Redis Engine Operational Error:', err));
RedisClient.on('end', () => console.warn('⚠️ Redis Connection Closed'));

// Immediately-Invoked Function Expression (IIFE) to handle initialization asynchronous workflow
(async () => {
  try {
    await RedisClient.connect();
  } catch (error) {
    console.error('❌ Failed to establish initial Redis channel:', error);
  }
})();

module.exports = { RedisClient };