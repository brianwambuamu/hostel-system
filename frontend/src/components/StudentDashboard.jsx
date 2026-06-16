// frontend/src/components/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { bookingAPI } from '../api/endpoints'; // Clean API layer abstraction abstraction

export default function StudentDashboard({ studentId }) {
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [message, setMessage] = useState('');

  // Fetch rooms on component mount or when booking status updates
  useEffect(() => {
    bookingAPI.getRooms()
      .then(res => setRooms(res.data))
      .catch(err => console.error('Error tracking room grid metrics:', err));
  }, [booking]);

  // Handle countdown tracking when a temporary reservation exists
  useEffect(() => {
    if (!booking || booking.status !== 'Reserved') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setBooking(null);
          setMessage('🕒 Your reservation slot expired! The room was recycled back to the pool.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking]);

  const handleReserve = async (roomId) => {
    try {
      const res = await bookingAPI.reserveRoom(studentId, roomId);
      setBooking({ id: res.data.bookingId, status: 'Reserved' });
      setTimeLeft(1800);
      setMessage('🟢 Room locked! Complete payment execution immediately.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Conflict error during inventory lock.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.verifyPayment(booking.id, paymentRef.toUpperCase());
      setBooking(prev => ({ ...prev, status: 'Confirmed' }));
      setMessage('✅ Room allocation locked permanently! Report to the Warden within 48 hours.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment reference submission rejected.');
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ color: '#1a1a1a', margin: 0 }}>Polytechnic Housing Portal</h1>
        <p style={{ color: '#666', marginTop: '4px' }}>High-Concurrency Distributed Inventory Node</p>
      </header>

      {message && (
        <div style={{ padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '6px', marginBottom: '20px', color: '#0d47a1' }}>
          <strong>Status System Note:</strong> {message}
        </div>
      )}

      {booking && booking.status === 'Reserved' && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#b78103' }}>⚠️ Pending Financial Commitment Lock</h3>
          <p style={{ margin: '0 0 16px 0' }}>
            Time remaining to complete payment execution: 
            <strong style={{ fontSize: '18px', marginLeft: '6px', color: '#d32f2f' }}>
              {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
            </strong>
          </p>
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Enter M-Pesa Reference Code (e.g. QXD451MZ88)" 
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              style={{ padding: '10px', width: '350px', borderRadius: '4px', border: '1px solid #ccc' }}
              required 
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Reconcile Payment
            </button>
          </form>
        </div>
      )}

      <h2>Available Room Selection Grid</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {rooms.map(room => (
          <div key={room._id} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Room {room.roomNumber}</h4>
            <p style={{ color: '#555', fontSize: '14px' }}>Beds Taken: {room.occupiedBeds} / {room.capacity}</p>
            <button 
              onClick={() => handleReserve(room._id)}
              disabled={booking !== null || room.occupiedBeds >= room.capacity}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: room.occupiedBeds >= room.capacity ? '#e0e0e0' : '#1565c0',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: booking ? 'not-allowed' : 'pointer'
              }}
            >
              {room.occupiedBeds >= room.capacity ? 'Full' : 'Reserve Bed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}