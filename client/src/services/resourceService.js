import api from './api';

export const jobService = {
  getAll: (params) => api.get('/api/jobs', { params }),
  getById: (id) => api.get(`/api/jobs/${id}`),
  create: (data) => api.post('/api/jobs', data),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  delete: (id) => api.delete(`/api/jobs/${id}`),
  getStats: () => api.get('/api/jobs/stats'),
  uploadResume: (id, formData) =>
    api.post(`/api/jobs/${id}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const companyService = {
  getAll: (params) => api.get('/api/companies', { params }),
  getById: (id) => api.get(`/api/companies/${id}`),
  create: (data) => api.post('/api/companies', data),
  update: (id, data) => api.put(`/api/companies/${id}`, data),
  delete: (id) => api.delete(`/api/companies/${id}`),
};

export const interviewService = {
  getAll: (params) => api.get('/api/interviews', { params }),
  getUpcoming: () => api.get('/api/interviews/upcoming'),
  getById: (id) => api.get(`/api/interviews/${id}`),
  create: (data) => api.post('/api/interviews', data),
  update: (id, data) => api.put(`/api/interviews/${id}`, data),
  delete: (id) => api.delete(`/api/interviews/${id}`),
};

export const noteService = {
  getByJob: (jobId) => api.get(`/api/notes/job/${jobId}`),
  create: (data) => api.post('/api/notes', data),
  update: (id, data) => api.put(`/api/notes/${id}`, data),
  delete: (id) => api.delete(`/api/notes/${id}`),
};

export const notificationService = {
  getAll: () => api.get('/api/notifications'),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};
