import React, { useEffect, useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';

const DataPrices = () => {
  const networks = [
    { id: '1', name: 'MTN' },
    { id: '2', name: 'AIRTEL' },
    { id: '3', name: '9MOBILE' },
    { id: '4', name: 'GLO' },
  ];
  const authAxios = createAuthAxios();
  
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [pricingData, setPricingData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleNetworkChange = (e) => {
    const networkId = e.target.value;
    setSelectedNetwork(networkId);

    if (networkId) {
      setLoading(true);
      authAxios
        .post('/pricing/', { action: 'data', id: networkId })
        .then((res) => {
          setPricingData(res.data.message);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  const renderTables = () => {
    if (!pricingData || Object.keys(pricingData).length === 0) return null;
  
    const networkKey = Object.keys(pricingData)[0]; // e.g., "AIRTEL"
    const dataTypes = pricingData[networkKey];
  
    // Function to determine additional cost
    const getAdditionalCost = (plan) => {
      const planSizeMatch = plan.plan.match(/(\d+(\.\d+)?)(GB|MB|TB)/i);
      if (!planSizeMatch) return 8;
  
      const size = parseFloat(planSizeMatch[1]);
      const unit = planSizeMatch[3].toUpperCase();
  
      // Convert size to GB
      const sizeInGB = unit === 'TB' ? size * 1024 : unit === 'MB' ? size / 1024 : size;
      return sizeInGB >= 5 ? 13 : 6;
    };
  
    return Object.keys(dataTypes).map((type) => {
      const plans = dataTypes[type];
      return (
        <div key={type} className="my-8">
          <h3 className="text-lg font-bold text-green-600">{type}</h3>
          <table className="table-auto w-full border-collapse border border-green-600 mt-4">
            <thead>
              <tr className="bg-green-100 text-green-700">
                <th className="border border-green-600 px-4 py-2">Plan</th>
                <th className="border border-green-600 px-4 py-2">Amount</th>
                <th className="border border-green-600 px-4 py-2">Validity</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="text-center hover:bg-green-50">
                  <td className="border border-green-600 px-4 py-2">{plan.plan}</td>
                  <td className="border border-green-600 px-4 py-2">₦{parseFloat(plan.plan_amount) + 8}</td>
                  <td className="border border-green-600 px-4 py-2">{plan.month_validate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  };  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Data Prices</h1>
      <div className="mb-6">
        <label htmlFor="network-select" className="block text-lg font-medium text-green-700 mb-2">
          Select Network:
        </label>
        <select
          id="network-select"
          onChange={handleNetworkChange}
          value={selectedNetwork}
          className="block w-full border border-green-600 rounded px-4 py-2 bg-white text-green-700 focus:ring focus:ring-green-300 focus:outline-none"
        >
          <option value="">--Select a Network--</option>
          {networks.map((network) => (
            <option key={network.id} value={network.id}>
              {network.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-green-600"
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
        </div>
      ) : (
        renderTables()
      )}
    </div>
  );
};

export default DataPrices;
