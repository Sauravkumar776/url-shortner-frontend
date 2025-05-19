/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = 'http://localhost:7784/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const get = (url: string, config = {}) => api.get(url, config);
export const post = (url: string, data: any, config = {}) => api.post(url, data, config);
export const put = (url: string, data: any, config = {}) => api.put(url, data, config);
export const del = (url: string, config = {}) => api.delete(url, config);
