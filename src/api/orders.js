import apiClient from './client';

export const orderAPI = {
  createOrder: async (orderData) => {
    const response = await apiClient.post('/api/orders', orderData);
    return response.data;
  },

  getQueue: async () => {
    const response = await apiClient.get('/api/orders/queue');
    return response.data;
  },

  getBaristaStatus: async () => {
    const response = await apiClient.get('/api/barista/status');
    return response.data;
  },

  getAllBaristas: async () => {
    const response = await apiClient.get('/api/barista/all');
    return response.data;
  },

  completeOrder: async () => {
    const response = await apiClient.post('/api/barista/complete');
    return response.data;
  },

  completeBaristaOrder: async (baristaId) => {
    const response = await apiClient.post(`/api/baristas/${baristaId}/complete`);
    return response.data;
  },

  getMetrics: async () => {
    const response = await apiClient.get('/api/manager/metrics');
    return response.data;
  },

  getAlerts: async () => {
    const response = await apiClient.get('/api/manager/alerts');
    return response.data;
  },

  runSimulation: async (testCase) => {
    const response = await apiClient.post('/api/manager/simulation', { testCase });
    return response.data;
  },
};
