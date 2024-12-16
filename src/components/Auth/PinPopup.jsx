import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createAuthAxios } from '@/api/authAxios';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const PinPopup = ({ isOpen, onClose, pin, setPin, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false); // State to track loading
  const authAxios = createAuthAxios();

  const verifyPin = async (pinEntered) => {
    try {
      const res = await authAxios.post('/pin/verify/', { pin: pinEntered });
      console.log(res.data.success);
      return res.data.success; // returns true or false based on verification
    } catch (err) {
      console.error(err);
      return false; // return false if there's an error
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (pin.length === 4) {
      setLoading(true); // Start loading
      try {
        const isVerified = await verifyPin(pin);
        if (isVerified) {
          onSuccess();
          // toast.success('PIN verified successfully');
        } else {
          onError();
          toast.error('Invalid PIN');
        }
      } finally {
        setLoading(false); // End loading
      }
    } else {
      toast.error('Please enter a complete PIN');
    }
  };

  return (
    <div className="fixed p-2 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="animate-popup bg-white p-4 rounded-lg w-[30rem] h-[20rem] flex items-center justify-center flex-col text-center">
        <h2 className="text-2xl font-semibold mb-6">Enter Your PIN</h2>
        <div className="grid gap-1 place-content-center mb-5">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e)}
            className="task-input mb-1"
          >
            <InputOTPGroup className="gap-8">
              <InputOTPGroup>
                <InputOTPSlot index={0} autoFocus={true} type="password"/>
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={1} type="password"/>
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} type="password"/>
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} type="password"/>
              </InputOTPGroup>
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="px-6 w-full">
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-green-500 text-white font-semibold rounded-2xl hover:bg-green-600 flex items-center justify-center"
            disabled={loading} // Disable button when loading
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Verify PIN"
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinPopup;
