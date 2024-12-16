import React, { useRef, useState, useContext, useEffect } from 'react';
import frens from '../assets/frens.jpg';
import { DashboardContext } from '@/context/DashboardContext';
import 'boxicons/css/boxicons.min.css';
import { toast } from 'react-toastify';
import { createAuthAxios } from '@/api/authAxios';

const ReferralsPage = () => {
    const { user } = useContext(DashboardContext);
    const authAxios = createAuthAxios();
    const url_value = `https://www.dataease.com.ng/register?r=${user?.username}`;
    const inputRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [referralsData, setReferralsData] = useState(null);
    const [loading, setLoading] = useState(false); // State for tracking the loading state

    const copyToClipboard = () => {
        const text = inputRef.current.value;
        navigator.clipboard.writeText(text)
            .then(() => toast.success('Copied!'))
            .catch(() => setCopySuccess('Failed to copy!'));
    };

    useEffect(() => {
        authAxios.get('/referral/')
            .then((res) => {
                setReferralsData(res.data); // Assuming API response matches the structure
            })
            .catch(console.error);
    }, []);

    const withdrawBonus = () => {
        setLoading(true); // Start loading
        authAxios.post('/referral/', { action: 'withdraw' })
            .then((res) => {
                toast.success(res.data.message);
                setLoading(false); // Stop loading
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                setLoading(false); // Stop loading
            });
    };

    return (
        <div>
            <div className="flex justify-center items-center">
                <img src={frens} className="w-640" alt="" />
            </div>
            <div className="mb-5 text-center">
                <h1 className="text-2xl font-bold">Refer a friend, Earn a reward</h1>
                <p className="text-gray-600">Invite a friend to signup and make a purchase</p>
                <p className="text-gray-600">Earn ₦30 for every friend you refer!</p>
            </div>
            <div className="flex justify-center items-center w-full max-w-3xl mx-auto">
                <div className="sm:w-full w-96 flex">
                    <input
                        ref={inputRef}
                        type="text"
                        value={url_value}
                        readOnly
                        className="h-16 rounded-l-xl w-full border-2 px-3 border-vibrantGreen"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="bg-vibrantGreen rounded-r-xl w-36 text-white font-medium"
                    >
                        Copy Link
                    </button>
                </div>
            </div>
            {referralsData && (
                <div className="mt-6 max-w-3xl mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold mb-4">Referrals:</h1>
                    <ul className="list-disc pl-5 mb-4">
                        {referralsData.referals.map((referral, index) => (
                            <li key={index} className="text-gray-700">
                                {referral}
                            </li>
                        ))}
                    </ul>
                    <p className="text-gray-700">
                        <strong>Referral Count:</strong> {referralsData.ref_count}
                    </p>
                    <p className="text-gray-700">
                        <strong>Referral Bonus:</strong> ₦{referralsData.ref_bonus}
                    </p>
                    <button
                        onClick={withdrawBonus}
                        className={`mt-4 w-full py-2 bg-vibrantGreen text-white font-medium rounded-md hover:bg-green-700 transition-colors flex justify-center items-center ${loading ? 'cursor-not-allowed' : ''}`}
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
                </div>
            )}
        </div>
    );
};

export default ReferralsPage;
