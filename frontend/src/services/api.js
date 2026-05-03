import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// Post endpoints
export const postService = {
  getPosts: (page = 1, category = 'All', search = '') =>
    api.get('/posts', { params: { page, category, search } }),
  getAdminPosts: () =>
    api.get('/posts/admin'),
  getPost: (id) =>
    api.get(`/posts/${id}`),
  createPost: (data) =>
    api.post('/posts', data),
  updatePost: (id, data) =>
    api.put(`/posts/${id}`, data),
  deletePost: (id) =>
    api.delete(`/posts/${id}`),
  togglePublish: (id) =>
    api.patch(`/posts/${id}/publish`),
};

// Upload endpoint
export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Message endpoints
export const messageService = {
  sendMessage: (data) => api.post('/messages', data),
  getMessages: () => api.get('/messages'),
  toggleReadStatus: (id) => api.patch(`/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

export default api;
