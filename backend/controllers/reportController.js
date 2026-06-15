const Booking = require('../models/Booking');

exports.exportEmergencyRoster = async (req, res) => {
  try {
    const records = await Booking.find({ status: 'CheckedIn' })
      .populate('studentId', 'name regNumber phoneNumber')
      .populate('roomId', 'roomNumber');

    const csvRows = ["Hostel,Room,Student,Phone"];
    records.forEach(r => {
      csvRows.push(`${r.roomId.hostelId.name},${r.roomId.roomNumber},${r.studentId.name},${r.studentId.phoneNumber}`);
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('Emergency_Manifest.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ message: "Report generation failed." });
  }
};