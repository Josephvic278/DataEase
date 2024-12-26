import React, { useEffect, useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import { format, isToday } from 'date-fns';

const TransactionSection = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaySpent, setTodaySpent] = useState(0);
  const [todayFunded, setTodayFunded] = useState(0);
  const authAxios = createAuthAxios();

  useEffect(() => {
    authAxios.get('/payments/')
      .then((res) => {
        const allTransactions = JSON.parse(res.data.message);
        const sortedTransactions = allTransactions
          .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
          .slice(0, 3); // Limit to 3 most recent transactions

        const todayTransactions = allTransactions.filter(transaction => isToday(new Date(transaction.date_created)));
        const spent = todayTransactions
          .filter(transaction => transaction.credit_type === 'debit')
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        const funded = todayTransactions
          .filter(transaction => transaction.credit_type !== 'debit')
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        setTransactions(sortedTransactions);
        setTodaySpent(spent);
        setTodayFunded(funded);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-5 px-3 pb-16">
      <h2 className="text-2xl font-bold text-black dark:text-white">Recent Transactions</h2>

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
      ) : (
        <>
          <div className="mt-4 space-y-4">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md shadow-slate-100 border border-neutral-300 w-1/2 mr-2">
              <h3 className="text-lg font-semibold text-black dark:text-white">Money Spent Today</h3>
              <p className="text-2xl font-bold text-red-500">₦{todaySpent}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md shadow-slate-100 border border-neutral-300 w-1/2 ml-2">
              <h3 className="text-lg font-semibold text-black dark:text-white">Money Funded Today</h3>
              <p className="text-2xl font-bold text-green-500">₦{todayFunded}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TransactionItem = ({ transaction }) => {
  const { amount, date_created, remark, status, credit_type } = transaction;

  // Determine the amount color based on credit_type
  const amountColor =
    credit_type === 'debit'
      ? 'text-red-500'
      : 'text-green-500'; // Default to green if not 'debit'

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md shadow-slate-100 border border-neutral-300">
      {/* Funding Icon */}
      <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-green-500 bg-opacity-80">
        <i className="pi pi-money-bill text-xl lg:text-3xl text-white"></i>
      </div>

      {/* Transaction Details */}
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold text-black text-opacity-90 dark:text-white">
          {credit_type === 'debit' ? 'Purchase' : 'Funding'}
        </h3>
        <p className="text-sm text-gray">{format(new Date(date_created), 'MMM dd, h:mm a')}</p>
        <p className="text-sm text-gray">{credit_type === 'debit' ? 'Product purchase' : remark}</p>
      </div>

      {/* Amount and Status */}
      <div className="text-right">
        <p
          className={`text-lg font-medium ${
            status === 'Pending'
              ? 'text-yellow-500'
              : credit_type === 'debit'
              ? 'text-red-500'
              : 'text-green-500'
          }`}
        >
          {credit_type === 'debit' ? '-' : ''} ₦{amount}
        </p>
        <p className="text-sm text-gray">{status}</p>
      </div>
    </div>
  );
};

export default TransactionSection;
