import React, { useEffect, useState } from "react";
import { createAuthAxios } from "@/api/authAxios";

const TransactionsSection = ({
  title,
  apiEndpoint,
  requestType = "POST",
  requestBody = null,
  showPlan,
  searchTerm, // Receive the search term from parent
}) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]); // To hold filtered results
  const [loading, setLoading] = useState(true); // State to manage loading
  const authAxios = createAuthAxios();

  const fetchTransactions = () => {
    const request =
      requestType === "POST"
        ? authAxios.post(apiEndpoint, requestBody)
        : authAxios.get(apiEndpoint);

    request
      .then((res) => {
        // console.log(res)
        const sortedTransactions = JSON.parse(res.data.message).sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        );
        setTransactions(sortedTransactions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on the searchTerm
    if (searchTerm) {
      const filtered = transactions.filter((transaction) =>
        (transaction.reference || transaction.reference_id)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions); // Reset if search term is empty
    }
  }, [searchTerm, transactions]);

  const getStatusClass = (status) => {
    if (!status) return ""; // Handle null or undefined status
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  return (
    <div className=" mx-auto py-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
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
                <th className="px-4 py-2 border-b">User</th>
                <th className="px-4 py-2 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2 border-b">{transaction.id}</td>
                    <td className="px-4 py-2 border-b">{transaction.amount}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(transaction.date_created).toLocaleString()}
                    </td>
                    {showPlan && (
                      <td className="px-4 py-2 border-b">{transaction.plan}</td>
                    )}
                    <td
                      className={`px-4 py-2 border-b font-bold ${getStatusClass(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {transaction.reference || transaction.reference_id}
                    </td>
                    <td className="px-4 py-2 border-b">{transaction.user}</td>
                    {transaction.credit_type=='credit'?(
                    <td className="px-4 py-2 border-b text-green-600 font-bold">{transaction.credit_type}</td>
                    ):(
                    <td className="px-4 py-2 border-b text-red-600 font-bold">{transaction.credit_type}</td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-2 border-b text-center"
                    colSpan={showPlan ? 5 : 4}
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
