import React, { useEffect, useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';

const TransactionsPaymentPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const authAxios = createAuthAxios();
  const currentUrl = `${window.location.protocol}//${window.location.host}`
  useEffect(() => {
    authAxios.get('/payments/')
      .then((res) => {
        // Parse, then sort transactions by date in descending order
        const sortedTransactions = JSON.parse(res.data.message).sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        setTransactions(sortedTransactions); // Set the transactions state with sorted data
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Set loading to false in case of error
      });
  }, []); // Removed authAxios from the dependency array

  const getStatusClass = (status) => {
    switch (status) {
      case 'Success':
        return 'text-green-500';
      case 'Failed':
        return 'text-red-500';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Date Created</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Remark</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Reference ID</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-2 border-b">{transaction.id}</td>
                  <td className="px-4 py-2 border-b">{transaction.amount}</td>
                  <td className="px-4 py-2 border-b">{new Date(transaction.date_created).toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{transaction.type}</td>
                  <td className="px-4 py-2 border-b">{transaction.remark}</td>
                  <td className={`px-4 py-2 border-b font-bold ${getStatusClass(transaction.status)}`}>{transaction.status}</td>
                  <td className="px-4 py-2 border-b">{transaction.reference_id}</td>
                  <td className="px-4 py-2 border-b font-bold"><a href={`${currentUrl}/reciept?id=${transaction.id}&type=fund`}
                className='flex items-center'>View <i class='bx bx-book-content ml-2' ></i></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsPaymentPage;
