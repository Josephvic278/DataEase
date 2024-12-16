import React, { useEffect, useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import 'boxicons/css/boxicons.min.css';

const PricingPage = () => {
  const authAxios = createAuthAxios();
  const [packages, setPackages] = useState({});
  const [category, setCategory] = useState('DSTV'); // Default category
  const [sortOrder, setSortOrder] = useState('asc'); // Sort by ascending order by default
  const [selectedProduct, setSelectedProduct] = useState('cable'); // Default product type
  const [loading, setLoading] = useState(false); // Loader state

  const productTabs = [
    { name: 'Cable', icon: 'bx-tv', action: 'cable' },
    // { name: 'Data', icon: 'bx-data', action: 'data' },
    { name: 'Education', icon: 'bx-book', action: 'education' },
    // { name: 'Airtime', icon: 'bx-phone', action: 'airtime' },
    { name: 'Electricity', icon: 'bx-cloud-lightning', action: 'electricity' },
  ];

  useEffect(() => {
    setLoading(true); // Start loading when fetching data
    authAxios
      .post('/pricing/', { action: selectedProduct })
      .then((res) => {
        setPackages(res.data.message);
        setCategory(Object.keys(res.data.message)[0] || 'DSTV'); // Automatically select first category
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false)); // Stop loading once the data is fetched
  }, [selectedProduct]);

  const sortedPackages = (packages[category] || []).slice().sort((a, b) => {
    const priceA = parseInt(a.price) + 150;
    const priceB = parseInt(b.price) + 150;
    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-left mb-8 text-gray-800">
        {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)} Packages Pricing
      </h1>

      {/* Tabs with Icons */}
      <div className="flex justify-between gap-3 mb-6 overflow-y-auto">
        {productTabs.map((tab) => (
          <button
            key={tab.action}
            onClick={() => {
              setSelectedProduct(tab.action);
            }}
            className={`flex flex-col items-center w-30 px-4 py-2 rounded-lg transition-colors duration-200 
                        ${selectedProduct === tab.action ? 'bg-vibrantGreen text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <i className={`bx ${tab.icon} text-2xl`}></i>
            <span className="mt-1 font-semibold">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        {/* Category Selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 w-40 rounded px-4 py-2"
        >
          {Object.keys(packages).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-vibrantGreen text-white px-4 py-2 rounded"
        >
          Sort Price ({sortOrder === 'asc' ? 'Low' : 'High'})
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <svg className="animate-spin h-10 w-10 text-vibrantGreen" viewBox="0 0 24 24">
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
          <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden border border-grey">
            <thead className="text-left text-black bg-gray-700">
              <tr>
                <th className="py-3 px-6 font-semibold uppercase tracking-wider">Package Name</th>
                <th className="py-3 px-6 font-semibold uppercase tracking-wider">Price</th>
                <th className="py-3 px-6 font-semibold uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sortedPackages.map((pkg, index) => (
                <tr
                  key={index}
                  className="bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="py-4 px-6 border-b border-gray-700">{pkg.package_name}</td>
                  <td className="py-4 px-6 border-b border-gray-700 text-vibrantGreen font-bold">
                    ₦{parseInt(pkg.price) + 150}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-700">30 Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
