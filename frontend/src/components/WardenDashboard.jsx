// frontend/src/components/WardenDashboard.jsx
import { useState, useEffect } from 'react';
import { reportAPI, transferAPI } from '../api/endpoints'; // Clean API layer abstractions

export default function WardenDashboard() {
  const [manifest, setManifest] = useState([]);
  const [search, setSearch] = useState('');

  // 1. Core Logic Functions declared first
  const fetchManifest = async () => {
    try {
      // Replaced raw axios with mapped report service configuration
      const res = await reportAPI.getActiveBookings(); 
      setManifest(res.data);
    } catch (err) {
      console.error('Error fetching inventory tracking records:', err);
    }
  };

  // 2. Hook side-effects invoked after their dependencies are defined
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchManifest();
  }, []);

  const handlePhysicalCheckIn = async (bookingId) => {
    try {
      // Swapped out literal string endpoint for dedicated transfer service call
      await transferAPI.confirmPhysicalCheckIn(bookingId);
      fetchManifest(); // Reload layout to show verified status matching reality
    } catch (err) {
      alert('Error updating physical location verification flag.');
    }
  };

  const handleTriggerExport = () => {
    // Dynamic base URL targeting instead of hardcoding localhost port mappings
    const downloadUrl = reportAPI.getEmergencyManifestUrl();
    window.open(downloadUrl, '_blank');
  };

  const filteredManifest = manifest.filter(item => 
    item.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.studentId?.regNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Warden Command Map View</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>Physical Presence Reconciliation and Security Records Verification</p>
        </div>
        <button 
          onClick={handleTriggerExport}
          style={{ padding: '12px 24px', backgroundColor: '#c62828', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🚨 Export Emergency Safety Roster (CSV)
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by student name or registration metric code..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '12px', width: '100%', maxWidth: '400px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '16px' }}>Student Identity</th>
              <th style={{ padding: '16px' }}>Reg Number</th>
              <th style={{ padding: '16px' }}>Room Target</th>
              <th style={{ padding: '16px' }}>Financial Clearance</th>
              <th style={{ padding: '16px' }}>Physical Reality Check</th>
            </tr>
          </thead>
          <tbody>
            {filteredManifest.map(row => (
              <tr key={row._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{row.studentId?.name}</td>
                <td style={{ padding: '16px', color: '#555' }}>{row.studentId?.regNumber}</td>
                <td style={{ padding: '16px' }}>Room {row.roomId?.roomNumber}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontSize: '14px' }}>
                    Cleared ({row.paymentReference || 'N/A'})
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => handlePhysicalCheckIn(row._id)}
                    disabled={row.status === 'CheckedIn'}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: row.status === 'CheckedIn' ? '#2e7d32' : '#ef6c00',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: row.status === 'CheckedIn' ? 'default' : 'pointer'
                    }}
                  >
                    {row.status === 'CheckedIn' ? ' Verified Present' : 'Confirm Body Presence'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredManifest.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                  No allocations tracked matching criteria parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}