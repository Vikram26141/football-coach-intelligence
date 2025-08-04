import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  signin: (credentials) => api.post('/auth/signin', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  validateToken: () => api.get('/auth/validate-token'),
};

// User API endpoints
export const userAPI = {
  getMatches: () => api.get('/user/matches'),
  getMatch: (matchId) => api.get(`/user/matches/${matchId}`),
  deleteMatch: (matchId) => api.delete(`/user/matches/${matchId}`),
  getSettings: () => api.get('/user/settings'),
  updateSettings: (settings) => api.put('/user/settings', settings),
};

// Coach API endpoints (main functionality)
export const coachAPI = {
  // Video upload and processing
  uploadVideo: (formData, onUploadProgress) => 
    api.post('/coach/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  
  // Video processing status
  getProcessingStatus: (matchId) => api.get(`/coach/processing/${matchId}`),
  
  // Analysis results
  getAnalysis: (matchId) => api.get(`/coach/analysis/${matchId}`),
  getEvents: (matchId) => api.get(`/coach/events/${matchId}`),
  getHeatmap: (matchId) => api.get(`/coach/heatmap/${matchId}`),
  getTimeline: (matchId) => api.get(`/coach/timeline/${matchId}`),
  
  // Live detection preview
  getDetectionPreview: (matchId, frameNumber) => 
    api.get(`/coach/preview/${matchId}`, { params: { frame: frameNumber } }),
  
  // Export reports
  exportReport: (matchId, format = 'json') => 
    api.get(`/coach/export/${matchId}`, { 
      params: { format },
      responseType: 'blob'
    }),
  
  // Analysis settings
  updateAnalysisSettings: (matchId, settings) => 
    api.put(`/coach/settings/${matchId}`, settings),
  
  // Batch operations
  batchProcess: (matchIds) => api.post('/coach/batch-process', { match_ids: matchIds }),
  batchExport: (matchIds, format = 'json') => 
    api.post('/coach/batch-export', { match_ids: matchIds, format }, {
      responseType: 'blob'
    }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('video', file);
  
  try {
    const response = await api.post('/coach/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Upload failed');
  }
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error || error.response.data?.message || 'Server error';
    return { error: true, message, status: error.response.status };
  } else if (error.request) {
    // Network error
    return { error: true, message: 'Network error. Please check your connection.', status: 0 };
  } else {
    // Other error
    return { error: true, message: error.message || 'An error occurred', status: 0 };
  }
};

// Success response helper
export const handleAPISuccess = (response) => {
  return {
    error: false,
    data: response.data,
    message: response.data?.message || 'Success',
    status: response.status,
  };
};

export default api; 