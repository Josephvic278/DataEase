import React, { useEffect, useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import moment from 'moment';

const TodaySummary = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authAxios = createAuthAxios();

  const fetchTransactions = () => {
    authAxios
      .post('/payments/', { action: 'information' }) // Use the same API logic as in TransactionSection
      .then((res) => {
        const sortedTransactions = JSON.parse(res.data.message).sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        );
        setTransactions(sortedTransactions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load transactions. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const today = moment().startOf('day');
  const todayTransactions = transactions.filter((transaction) =>
    moment(transaction.date_created).isSame(today, 'day')
  );

  const totalIn = todayTransactions
    .filter((transaction) => transaction.credit_type === 'credit')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  const totalOut = todayTransactions
    .filter((transaction) => transaction.credit_type === 'debit')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  return (
    <div className="w-full h-auto bg-white border border-gray-300 rounded-2xl px-7 pt-4 pb-5 mt-5">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Today's Summary</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/2 bg-green-100 border border-green-300 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Total In</h3>
            <p className="text-gray-500 tracking-wide mb-3">₦{totalIn.toFixed(2)}</p>
          </div>
          <div className="w-full md:w-1/2 bg-red-100 border border-red-300 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Total Out</h3>
            <p className="text-gray-500 tracking-wide mb-3">₦{totalOut.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaySummary;