// src/pages/MonnifyFundingPage.js
import React, { useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MonnifyFundingPage = () => {
  const navigate = useNavigate();
  const authAxios = createAuthAxios();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setAmount(''); // Allow clearing the input completely yeah
    } else {
      const numericValue = Math.min(Number(value), 100000);
      setAmount(numericValue);
    }
  };

  const redirectToExternalUrl = (url) => {
    window.location.href = url
  };

  const handleProceed = () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return;
    }else if(amount<20){
        toast.error("Minimum amount fundable is ₦20")
        return;
    }

    setLoading(true); // Set loading to true

    authAxios.post('/monnify/', { amount })
      .then((res) => {
        redirectToExternalUrl(res.data.message)
      })
      .catch((err) => {
        console.error(err);
        alert('An error occurred. Please try again.');
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  return (
    <div className='p-4 h-screen overflow-y-auto flex flex-col items-center'>
      <h2 className='font-semibold text-2xl mb-4'>Fund with Monnify</h2>
      <p className='text-gray-700 mb-8 text-center'>
        Enter an amount and click "Proceed" to be redirected to the checkout page, where you can choose to pay with your bank card or via transfer.
      </p>

      <div className='bg-white shadow-sm p-6 rounded-lg max-w-lg w-full'>
        <h3 className='text-lg font-semibold mb-4'>Enter Amount</h3>

        <label className='block text-gray-700 text-sm font-medium mb-2'>
          Amount (₦)
        </label>
        <input
          type='number'
          value={amount}
          onChange={handleAmountChange}
          placeholder='Enter amount'
          className='w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
          max="100000"
        />

        <button
          onClick={handleProceed}
          className={`w-full py-3 text-white font-semibold rounded-md ${loading ? 'bg-vibrantGreen' : 'bg-vibrantGreen'} hover:bg-green-600 transition`}
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white inline" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : 'Proceed'}
        </button>
        <p className='mt-2'>Fee: <b>1.5%  </b></p>
        <p className='text-xs mt-2 text-gray text-center'>
        *Funding delays may occur. Refresh your dashboard after using Monnify.</p>
      </div>

    </div>
  );
};

export default MonnifyFundingPage;
