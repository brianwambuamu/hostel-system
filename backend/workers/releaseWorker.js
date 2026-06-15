// backend/workers/releaseWorker.js
const cron = require('node-cron');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { RedisClient } = require('../config/redisConfig');

// Runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running background cleanup: Releasing expired bookings...');
  
  const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 mins ago

  const expiredBookings = await Booking.find({ 
    status: 'Reserved', 
    reservedAt: { $lt: threshold } 
  });

  for (const booking of expiredBookings) {
    // 1. Release room count
    await Room.updateOne({ _id: booking.roomId }, { $inc: { occupiedBeds: -1 } });
    
    // 2. Add back to Redis pool
    await RedisClient.incr(`room_capacity:${booking.roomId}`);
    
    // 3. Mark as Cancelled
    booking.status = 'Cancelled';
    await booking.save();
  }
});