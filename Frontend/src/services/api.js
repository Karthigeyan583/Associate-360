import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('assoc_access_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login/')) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('assoc_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh: refreshToken });
          const newAccessToken = res.data.access;
          localStorage.setItem('assoc_access_token', newAccessToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshErr) {
          // Refresh token expired or invalid -> logout
          localStorage.removeItem('assoc_access_token');
          localStorage.removeItem('assoc_refresh_token');
          localStorage.removeItem('assoc_user');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication
  async login(identifier, password) {
    const response = await apiClient.post('/auth/login/', {
      username: identifier,
      email: identifier,
      password: password,
    });
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  // Health check & diagnostics
  async checkHealth() {
    const startTime = performance.now();
    try {
      const response = await apiClient.get('/health/');
      const latency = Math.round(performance.now() - startTime);
      return { success: true, data: response.data, latency };
    } catch (error) {
      const latency = Math.round(performance.now() - startTime);
      return {
        success: false,
        error: error.message,
        latency,
        data: {
          status: 'offline',
          message: 'Unable to connect to Django REST API at http://127.0.0.1:8001/api',
          database: { connected: false }
        }
      };
    }
  },

  // Dashboard stats
  async getDashboardStats() {
    const response = await apiClient.get('/dashboard/stats/');
    return response.data;
  },

  // Associates
  async getAssociates(params = {}) {
    const response = await apiClient.get('/associates/', { params });
    return response.data;
  },

  async getAssociate(id) {
    const response = await apiClient.get(`/associates/${id}/`);
    return response.data;
  },

  async createAssociate(data) {
    const response = await apiClient.post('/associates/', data);
    return response.data;
  },

  async updateAssociate(id, data) {
    const response = await apiClient.patch(`/associates/${id}/`, data);
    return response.data;
  },

  async extendAgreement(associateId, data) {
    const response = await apiClient.post(`/associates/${associateId}/extend-agreement/`, data);
    return response.data;
  },

  async updateCompliance(associateId, data) {
    const response = await apiClient.patch(`/associates/${associateId}/update-compliance/`, data);
    return response.data;
  },

  // Clients
  async getClients() {
    const response = await apiClient.get('/clients/');
    return response.data;
  },

  async createClient(data) {
    const response = await apiClient.post('/clients/', data);
    return response.data;
  },

  // Agreements
  async getAgreements() {
    const response = await apiClient.get('/agreements/');
    return response.data;
  },

  // Activity Logs
  async getActivities() {
    const response = await apiClient.get('/activities/');
    return response.data;
  },

  // Reports & Analytics
  async getReportsAnalytics() {
    const response = await apiClient.get('/reports/analytics/');
    return response.data;
  },

  async getReportsCatalogue(reportType = 'active_ba', params = {}) {
    const response = await apiClient.get('/reports/catalogue/', {
      params: { report: reportType, ...params }
    });
    return response.data;
  },

  async generateCustomReport(payload) {
    const response = await apiClient.post('/reports/custom/', payload);
    return response.data;
  },

  getExportCsvUrl(reportType = 'active_ba') {
    return `http://127.0.0.1:8001/api/reports/export/?report=${reportType}`;
  }
};

