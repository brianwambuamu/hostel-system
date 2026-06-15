const TransferRequest = require('../models/TransferRequest');
const { runInTransaction } = require('../config/db');
const Room = require('../models/Room');

exports.requestTransfer = async (req, res) => {
  const { studentId, currentRoomId, requestedRoomId, reason } = req.body;
  const request = new TransferRequest({ studentId, currentRoomId, requestedRoomId, reason });
  await request.save();
  res.status(201).json({ message: "Request submitted to Warden." });
};

exports.approveTransfer = async (req, res) => {
  const { requestId } = req.params;

  try {
    await runInTransaction(async (session) => {
      const transfer = await TransferRequest.findById(requestId).session(session);
      
      // Update room counters
      await Room.updateOne({ _id: transfer.currentRoomId }, { $inc: { occupiedBeds: -1 } }, { session });
      await Room.updateOne({ _id: transfer.requestedRoomId }, { $inc: { occupiedBeds: 1 } }, { session });
      
      transfer.status = 'Approved';
      await transfer.save({ session });
    });
    res.status(200).json({ message: "Swap executed." });
  } catch (error) {
    res.status(500).json({ message: "Transfer failed." });
  }
};