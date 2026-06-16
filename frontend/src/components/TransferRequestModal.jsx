// frontend/src/components/TransferRequestModal.jsx
import { useState } from 'react';
import axios from 'axios';

export default function TransferRequestModal({ studentId, currentRoomId, onClose }) {
  const [requestedRoomNumber, setRequestedRoomNumber] = useState('');
  const [reason, setReason] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    try {
      // First find room database ID by string matching configuration 
      const roomCheck = await axios.get(`http://localhost:5000/api/bookings/rooms/search?number=${requestedRoomNumber}`);
      const requestedRoomId = roomCheck.data._id;

      await axios.post('http://localhost:5000/api/transfers/request', {
        studentId,
        currentRoomId,
        requestedRoomId,
        reason
      });

      setStatusMessage('🟢 Swap request registered. Hand over keys only after Warden digital sign-off.');
      setTimeout(() => { onClose(); }, 2500);
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Error executing transfer indexing query.');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <h2 style={{ margin: '0 0 16px 0' }}>Request Official Room Swap</h2>
        
        {statusMessage && (
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmitTransfer}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Target Room Number</label>
            <input 
              type="text" 
              placeholder="e.g. 104"
              value={requestedRoomNumber} 
              onChange={(e) => setRequestedRoomNumber(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Reason for Room Transfer</label>
            <textarea 
              rows="3"
              placeholder="Provide a valid administrative or health reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', backgroundColor: '#757575', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#e65100', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}