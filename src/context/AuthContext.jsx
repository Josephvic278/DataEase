import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  // Refresh access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const { data } = await axiosInstance.post('/users/auth/jwt/refresh/', { refresh: refreshToken });
        setAccessToken(data.access);
        localStorage.setItem('accessToken', data.access);
        return data.access;
      }
    } catch (error) {
      handleTokenError(error);
      return null;
    }
  };

  // Refresh token every 4 hours
  const scheduleTokenRefresh = useCallback(() => {
    const refreshInterval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (newToken) setAccessToken(newToken);
    }, 4 * 60 * 60 * 1000); // Every 4 hours

    return () => clearInterval(refreshInterval);
  }, []);

  // Initial token setup or when the user returns to the page
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const storedAccessToken = localStorage.getItem('accessToken');

      if (!storedAccessToken && refreshToken) {
        // If no access token but refresh token exists, request a new access token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          scheduleTokenRefresh(); // Schedule refresh every 4 hours
        } else {
          logout();
        }
      } else if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        scheduleTokenRefresh();
      }
    };

    checkAndRefreshToken();
  }, [scheduleTokenRefresh]);

   // Function to initialize or refresh token on page load
   useEffect(() => {
    const initializeToken = async () => {
      if (!accessToken) {
        await refreshAccessToken();
      }
    };
    initializeToken();
  }, [accessToken, refreshAccessToken]);

  // Register user
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/users/register/', userData);
      setUser(response.data);
      setOtpSent(true);
      toast.success('Registration successful! OTP sent to your email.');
    } catch (error) {
      handleError(error);
      console.log(error)
    }
  };

  // Verify OTP and log in user
  const verifyOtp = async (email, otp) => {
    try {
      const response = await axiosInstance.post('/users/verify-otp/', { email, otp });
      setUser(response.data);
      setOtpVerified(true);
      toast.success('Verification Successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'OTP verification failed.');
    }
  };

  // Log in user (JWT Authentication)
  const loginUser = async (username, password) => {
    try {
      const { data } = await axiosInstance.post('/users/auth/jwt/create/', { username, password });
      setAccessToken(data.access);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      // toast.success('Login successful!');
      scheduleTokenRefresh();
      navigate('/dashboard');
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    try {
      await axiosInstance.post('/users/resend-otp/', { email });
      toast.success('OTP resent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  // Log out user and clear tokens
  const logout = ({ message }) => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user')
    navigate('/');
    // message ? toast.info(message) : toast.info('Logged out successfully!');
  };

  // Handle Errors
  const handleError = (error) => {
    const errors = error.response?.data || {};
    if (errors.email) {
      toast.error(errors.email[0]);
    }else if (errors.phone_number){
      toast.error(errors.phone_number[0]);
    }else if (errors.username) {
      toast.error(errors.username[0]);
    }else if (errors.last_name[0]){
      toast.error('Ensure you have your first and last name!');
    }
    else if (error.response?.status === 401) {
      // toast.error(error.response.data.detail);
    }
  };

  // Handle token refresh error
  const handleTokenError = (error) => {
    console.error("Token refresh error:", error);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.error('Session expired. Please log in again.');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        otpSent,
        otpVerified,
        register,
        verifyOtp,
        loginUser,
        refreshAccessToken,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
