import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Create an instance of axios with default settings
const authAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  // baseURL: 'https://vtu-h5yu.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create an instance of authAxios with context
export const createAuthAxios = () => {
  const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);

  // Set the Authorization header using the access token
  const config = {
    ...authAxios.defaults,
    headers: {
      ...authAxios.defaults.headers,
      Authorization: `Bearer ${accessToken || ''}`,
    },
  };

  const instance = axios.create(config);

  // Add request interceptor to handle token refresh if token is missing
  instance.interceptors.request.use(
    async (config) => {
      if (!accessToken) {
        const token = await refreshAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle 401 errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        logout("Session expired. Please log in again.");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default authAxios;
