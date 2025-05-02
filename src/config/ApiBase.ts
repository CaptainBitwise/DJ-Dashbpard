import axios from 'axios';
import useAuthStore from '../lib/state/useAuthStore';

const ApiUrl = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

ApiUrl.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default ApiUrl;
