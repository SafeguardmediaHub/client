import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log('api interceptor is running');
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('api/auth/refresh');

        return api(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired. Please log in again.');
        console.error('Refresh failed:', refreshError);
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
