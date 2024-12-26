import React, { useState, useEffect, useRef } from 'react';
import { createAuthAxios } from '@/api/authAxios';

const TransactionsPurchase = () => {
  const [dataTransactions, setDataTransactions] = useState([]);
  const [airtimeTransactions, setAirtimeTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [currentView, setCurrentView] = useState('data'); // Toggle between 'data' and 'airtime'
  const authAxios = createAuthAxios();
  const currentUrl = `${window.location.protocol}//${window.location.host}`
  // console.log(currentUrl)
  const fetchTransactions = (action, setter) => {
    authAxios
      .post('/purchases/', { action })
      .then((res) => {
        const sortedTransactions = JSON.parse(res.data.message).sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        );
        setter(sortedTransactions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Fetch both data and airtime transactions
    fetchTransactions('data', setDataTransactions);
    fetchTransactions('airtime', setAirtimeTransactions);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'Failed':
        return 'text-red-500';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  const renderTable = (transactions, showPlan) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Amount</th>
            <th className="px-4 py-2 border-b">Date Created</th>
            {showPlan && <th className="px-4 py-2 border-b">Plan</th>}
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Reference ID</th>
            <th className="px-4 py-2 border-b">Phone Number</th>
            <th className="px-4 py-2 border-b">Balance Before</th>
            <th className="px-4 py-2 border-b">Balance After</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-2 border-b text-center">{transaction.id}</td>
              <td className="px-4 py-2 border-b text-center">{transaction.amount}</td>
              <td className="px-4 py-2 border-b text-center">{new Date(transaction.date_created).toLocaleString()}</td>
              {showPlan && <td className="px-4 py-2 border-b text-center">{transaction.plan}</td>}
              <td className={`px-4 py-2 border-b font-bold text-center ${getStatusClass(transaction.status)}`}>
                {transaction.status}
              </td>
              <td className="px-4 py-2 border-b text-center">{transaction.reference}</td>
              <td className="px-4 py-2 border-b text-center">{transaction.mobile_number}</td>
              <td className="px-4 py-2 border-b text-center">{transaction.balance_before}</td>
              <td className="px-4 py-2 border-b text-center">{transaction.balance_after}</td>
              {showPlan ?(
                <td className="px-4 py-2 border-b font-bold"><a href={`${currentUrl}/reciept?id=${transaction.id}&type=data`}
                className='flex items-center'>View <i class='bx bx-book-content ml-2' ></i></a></td>
              ):(
                <td className="px-4 py-2 border-b font-bold"><a href={`${currentUrl}/reciept?id=${transaction.id}&type=airtime`} className='flex items-center'>View <i class='bx bx-book-content ml-2' ></i></a></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            currentView === 'data' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCurrentView('data')}
        >
          Data Transactions
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === 'airtime' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCurrentView('airtime')}
        >
          Airtime Transactions
        </button>
      </div>
      {loading ? (
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
      ) : currentView === 'data' ? (
        renderTable(dataTransactions, true) // Show Plan column for Data Transactions
      ) : (
        renderTable(airtimeTransactions, false) // Hide Plan column for Airtime Transactions
      )}
    </div>
  );
};

export default TransactionsPurchase;
