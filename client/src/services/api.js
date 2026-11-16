import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const taskApi = {
  list: params => api.get('/tasks', { params }),
  create: data => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  toggle: id => api.patch(`/tasks/${id}/toggle`),
  remove: id => api.delete(`/tasks/${id}`)
};

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong';
}
