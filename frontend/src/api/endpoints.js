// frontend/src/api/endpoints.js
import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (regNumber, password) => 
    axiosInstance.post('/auth/login', { regNumber, password }),
};

export const bookingAPI = {
  // Fetch available rooms matching institutional inventory parameters
  getRooms: () => 
    axiosInstance.get('/bookings/rooms'),
    
  // High-concurrency ticket claim endpoint (locks slot inside Redis)
  reserveRoom: (studentId, roomId) => 
    axiosInstance.post('/bookings/reserve', { studentId, roomId }),
    
  // Verify financial mobile money reconciliation references
  verifyPayment: (bookingId, paymentReference) => 
    axiosInstance.post('/bookings/verify-payment', { bookingId, paymentReference }),
};

export const transferAPI = {
  // Submit an audited room exchange application
  requestTransfer: (transferData) => 
    axiosInstance.post('/transfers/request', transferData),
    
  // Warden digital sign-off execution
  approveTransfer: (requestId) => 
    axiosInstance.put(`/transfers/approve/${requestId}`),
    
  // Warden tracking flag adjustment (Bridges digital state to physical reality)
  confirmPhysicalCheckIn: (bookingId) => 
    axiosInstance.put(`/transfers/physical-checkin/${bookingId}`),
};

export const reportAPI = {
  // Pull confirmed students roster manifest
  getActiveBookings: () => 
    axiosInstance.get('/reports/active-bookings'),
    
  // Stream security manifest logs matching layout realities
  getEmergencyManifestUrl: () => 
    `${axiosInstance.defaults.baseURL}/reports/emergency-manifest`,
};