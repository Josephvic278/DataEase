import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import { Link } from 'react-router-dom';
import { createAuthAxios } from '@/api/authAxios';
import { toast } from 'react-toastify';

const FundAccountPage = () => {
  const authAxios = createAuthAxios();
  const [isAccountNull, setIsAccountNull] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    authAxios.get('/ava')
      .then((res) => {
        if (res.data.message.length > 0) {
          setBankAccounts(res.data.message);
          setIsAccountNull(false);
        } else {
          setIsAccountNull(true);
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const getRandomGradient = () => {
    const randomColor1 = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.2)`;
    const randomColor2 = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.2)`;
    return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
  };

  const formatAccountNumber = (accountNumber) => {
    return accountNumber.replace(/\d{4}(?=\d)/g, "$& ");
  };

  const openModal = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  return (
    <div className='p-4 h-screen overflow-y-auto flex flex-col items-center space-y-4'>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      ) : (
        <>
          {!isAccountNull && bankAccounts.length > 0 && (
            <div className='w-full max-w-4xl'>
              <h2 className='font-semibold text-xl mb-4'>Your Virtual Accounts</h2>
              <div className='flex space-x-4 py-2 overflow-x-auto sm:overflow-x-hidden hide-scrollbar'>
                {bankAccounts.map((account, index) => (
                  <div
                    key={index}
                    onClick={() => openModal(account)}
                    className='relative bg-white border border-gray-300 rounded-lg p-5 min-w-[250px] sm:flex-1 shadow-sm transform transition duration-500 hover:scale-105 cursor-pointer'
                    style={{ background: getRandomGradient() }}
                  >
                    <i className='bx bx-credit-card text-xl absolute top-3 right-3 text-gray-600'></i>

                    <h3 className='text-gray-700 text-sm font-semibold mb-2'>{account.bankName}</h3>
                    <div className='text-gray-800 text-lg font-semibold tracking-wide mb-6 font-poppins'>
                      {formatAccountNumber(account.accountNumber)}
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-gray-700 text-xs'>
                        <p className='font-light text-xs'>Account Name</p>
                        <p className='font-semibold'>{account.accountName}</p>
                      </div>
                      <div className='text-gray-700 text-right text-xs'>
                        <p className='font-light'>Tracking Id</p>
                        <p className='font-semibold'>{account.accountReference}</p>
                      </div>
                    </div>
                    <p className='p-0 text-xs text-gray -mb-4 mt-2 text-center'>*Tap on the account card to view</p>
                  </div>
                ))}
              </div>
              <p className='text-gray text-sm'>Make a transfer to your virtual account above and your wallet will be credited automatically</p>
              <b>Fee: 1.5%</b>
            </div>
          )}

         {isAccountNull && (
            <Link to='/virtual_account' className='w-full max-w-lg'>
              <div className='bg-green-100 rounded-lg p-6 flex w-full cursor-pointer shadow-sm'>
                <div className='flex items-center w-14 bg-green-300 rounded-md justify-center'>
                  <i className='bx bx-wallet-alt text-2xl text-white'></i>
                </div>
                <div className='ml-3'>
                  <h1 className='text-xl font-semibold'>Create Wallet</h1>
                  <p>Create your virtual wallet</p>
                </div>
              </div>
            </Link>
          )}

          {/* Link to Monnify Funding Page */}
          <Link to='/monnify' className='w-full max-w-lg'>
            <div className='bg-blue-100 rounded-lg p-6 flex w-full cursor-pointer mt-5 shadow-sm'>
              <div className='flex items-center w-14 bg-blue-300 rounded-md justify-center'>
                <i className='bx bx-money text-2xl text-white'></i>
              </div>
              <div className='ml-3'>
                <h1 className='text-xl font-semibold'>Fund with Monnify</h1>
                <p>Fund your account via Monnify</p>
              </div>
            </div>
          </Link>

          <Link to='/manual_funding' className='w-full max-w-lg'>
            <div className='bg-yellow-100 rounded-lg p-6 flex w-full cursor-pointer mt-5 shadow-sm'>
              <div className='flex items-center w-14 bg-yellow-300 rounded-md justify-center'>
                <i className='bx bxs-wallet-alt text-2xl text-white'></i>
              </div>
              <div className='ml-3'>
                <h1 className='text-xl font-semibold'>Manual Funding</h1>
                <p>Fund account via admin</p>
              </div>
            </div>
          </Link>
        </>
      )}

      {/* Modal for account details */}
      {showModal && selectedAccount && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-6 w-11/12 max-w-md'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Account Details</h2>
              <i className='bx bx-x cursor-pointer text-2xl' onClick={closeModal}></i>
            </div>
            <div className='mt-4'>
              <p><strong>Bank Name:</strong> {selectedAccount.bankName}</p>
              <p><strong>Account Number:</strong> {selectedAccount.accountNumber}</p>
              <p><strong>Account Name:</strong> {selectedAccount.accountName}</p>
              <p><strong>Tracking ID:</strong> {selectedAccount.accountReference}</p>
              <p><strong>Bank Code:</strong> {selectedAccount.bankCode}</p>
            </div>
            <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedAccount.accountNumber);
                  toast.success('Account number copied to clipboard');
                }}
                className='mt-4 w-full bg-blue-400 text-white py-2 rounded-lg'
              >
                Copy Account Number
              </button>
            {/* <button onClick={closeModal} className='mt-4 w-full bg-vibrantGreen text-white py-2 rounded-lg'>
              Close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundAccountPage;
