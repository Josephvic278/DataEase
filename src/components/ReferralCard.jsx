import { useState, useEffect } from 'react';
import authAxios from '../api/authAxios'; // Adjust the import based on your Axios setup
import { createAuthAxios } from '../api/authAxios';
import { toast } from 'react-toastify';

const ReferralCard = () => {
  const authAxios = createAuthAxios()
  const [referralsData, setReferralsData] = useState(null);
  const [loadingData, setLoadingData] = useState(true); // Loading state for fetching data
  const [loading, setLoading] = useState(false); // Loading state for withdraw action

  useEffect(() => {
    authAxios
      .get('/referral/')
      .then((res) => {
        setReferralsData(res.data);
        setLoadingData(false); // Stop loading when data is fetched
      })
      .catch((err) => {
        console.error(err);
        setLoadingData(false); // Stop loading even on error
      });
  }, []);

  const withdrawBonus = () => {
    setLoading(true);
    authAxios
      .post('/referral/', { action: 'withdraw' })
      .then((res) => {
        toast.success(res.data.message);
        setReferralsData((prev) => ({
          ...prev,
          ref_bonus: 0, // Reset bonus after withdrawal
        }));
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      });
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-green-500"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
      </div>
    );
  }

  return (
    referralsData && (
      <div className="max-w-3xl mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Referral Info:</h1>
        <p className="text-gray-700">
          <strong>Referral Count:</strong> {referralsData.ref_count}
        </p>
        <p className="text-gray-700">
          <strong>Referral Bonus:</strong> ₦{referralsData.ref_bonus}
        </p>
        <button
          onClick={withdrawBonus}
          className={`mt-4 w-full py-2 bg-vibrantGreen text-white font-medium rounded-md hover:bg-green-700 transition-colors flex justify-center items-center ${
            loading ? 'cursor-not-allowed' : ''
          }`}
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            'Withdraw'
          )}
        </button>
        <p className='text-gray text-xs text-center mt-2'>*Kindly to visit the referral page to get more insights on your referrals</p>

      </div>
    )
  );
};

export default ReferralCard;
