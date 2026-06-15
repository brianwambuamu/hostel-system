const { RedisClient } = require('../config/redisConfig');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { runInTransaction } = require('../config/db');

exports.reserveRoom = async (req, res) => {
  const { studentId, roomId } = req.body;

  try {
    // Check occupancy in Redis (Atomic check)
    const capacityKey = `room_capacity:${roomId}`;
    const currentCapacity = await RedisClient.get(capacityKey);

    if (!currentCapacity || parseInt(currentCapacity) <= 0) {
      return res.status(409).json({ message: "Room is currently full." });
    }

    // Atomic decrement
    await RedisClient.decr(capacityKey);

    // Save initial reservation
    const booking = await new Booking({ studentId, roomId, status: 'Reserved' }).save();
    
    res.status(201).json({ success: true, bookingId: booking._id });
  } catch (error) {
    res.status(500).json({ message: "System error during reservation." });
  }
};

exports.verifyPayment = async (req, res) => {
  const { bookingId, paymentReference } = req.body;

  // Use transaction to ensure booking status and room count remain consistent
  try {
    await runInTransaction(async (session) => {
      const booking = await Booking.findOneAndUpdate(
        { _id: bookingId, status: 'Reserved' },
        { status: 'Confirmed', paymentReference, confirmedAt: new Date() },
        { session, new: true }
      );

      if (!booking) throw new Error("Invalid booking or already processed.");
      
      await Room.updateOne(
        { _id: booking.roomId }, 
        { $inc: { occupiedBeds: 1 } }, 
        { session }
      );
    });
    res.status(200).json({ message: "Payment verified successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};