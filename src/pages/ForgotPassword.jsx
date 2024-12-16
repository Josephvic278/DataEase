import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');
  const [loading, setLoading] = useState(false);

  const authAxios = axiosInstance();

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/forgot-password/', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data.error)
    } finally {
      setLoading(false);
    }
  };

  // Handle reset code verification
  const handleResetCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/verify-reset-code/', {
        email,
        reset_code: resetCode,
      });
      setMessage(response.data.message);
      setResetToken(response.data.reset_token);
      setStep(3);
    } catch (error) {
      console.error(error.response?.data.error || error.message.error);
      toast.error(error.response?.data.error)
    } finally {
      setLoading(false);
    }
  };

  // Handle password strength check
  const checkPasswordStrength = (password) => {
    let strength = 0;
    let text = 'Weak';
    if (password.length >= 8) strength += 25;
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) strength += 25;
    if (/[@$!%*?&]/.test(password)) strength += 50;
    if (strength === 100) text = 'Strong';
    else if (strength >= 50) text = 'Medium';
    setPasswordStrength(strength);
    setStrengthText(text);
  };

  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength < 50) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/reset-password/', {
        reset_token: resetToken,
        new_password: newPassword,
      });
      setMessage('Password reset successfully! You can now log in.');
      setStep(4);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <div className="w-full max-w-md mt-32 mb-64 p-8 bg-white shadow-lg rounded-md">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Forgot Password</h2>
            <label className="block mb-2">Enter your email</label>
            <input
              type="email"
              className="w-full p-2 mb-4 border rounded-md focus:outline-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeHolder={'Email Address'}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetCodeSubmit}>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Verify Reset Code</h2>
            <p className="mb-4 text-green-600">{message} <i className="bx bxs-check-square"></i></p>
            <label className="block mb-2">Enter the reset code</label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded-md focus:outline-green-500"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              placeholder='Reset Code'
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Reset Password</h2>
            <label className="block mb-2">Enter your new password</label>
            <input
              type="password"
              className="w-full p-2 mb-2 border rounded-md focus:outline-green-500"
              value={newPassword}
              placeholder='New Password'
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              required
            />
            <div className="w-full bg-gray-200 h-2 rounded-md mb-1">
              <div
                className={`h-full rounded-md transition-all ${
                  passwordStrength >= 50
                    ? passwordStrength === 100
                      ? 'bg-green-600'
                      : 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <p className="mb-4 text-sm font-semibold text-gray-600">{strengthText}</p>
            <ul className="text-sm mb-4 text-gray-500">
              <li>• At least 8 characters</li>
              <li>• A mix of letters and numbers</li>
              <li>• At least one special character (@$!%*?&)</li>
            </ul>
            <button
              type="submit"
              className={`w-full py-2 rounded-md flex items-center justify-center ${
                passwordStrength >= 50
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed bg-green-100'
              }`}
              disabled={passwordStrength < 50 || loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        {step === 4 && <p className="text-green-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
