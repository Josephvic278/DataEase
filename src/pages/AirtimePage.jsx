import React, { useState, useEffect } from 'react';
import authAxios from '@/api/authAxios';
import { toast } from 'react-toastify';
import { createAuthAxios } from '@/api/authAxios';
// Sample images for each network
import mtnLogo from '@/assets/mtn.svg';
import airtelLogo from '@/assets/airtel.svg';
import gloLogo from '@/assets/glo.svg';
import mobile9Logo from '@/assets/9mobile.svg';
import PinPopup from '@/components/Auth/PinPopup';
import Swal from 'sweetalert2';

const AirtimePage = () => {
  const authAxios = createAuthAxios();
  const [selectedNetworkId, setSelectedNetworkId] = useState(''); // Store the selected network ID
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [adjustedAmount, setAdjustedAmount] = useState(''); // State to store adjusted amount
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bypassValidator, setBypassValidator] = useState(false); // State for bypass validator

  const networks = [
    { id: '1', name: 'mtn', logo: mtnLogo },
    { id: '2', name: 'airtel', logo: airtelLogo },
    { id: '3', name: 'glo', logo: gloLogo },
    { id: '4', name: '9mobile', logo: mobile9Logo },
  ];

  const handleCloseModal = () => setIsModalOpen(false);

  const handleNetworkSelect = (id) => {
    console.log(`Selected Network ID: ${id}`); // Log selected network ID
    setSelectedNetworkId(id); // Store the selected network ID
  };

  const handlePinSuccess = () => {
    setIsModalOpen(false);
    setLoading(true);

    const requestBody = {
      network: selectedNetworkId,
      number: phoneNumber,
      amount: amount,
      bypass_validator: bypassValidator,
    };

    authAxios.post('/airtime/', requestBody)
      .then(res => {
        if (res.data.status === 'error') {
          // toast.error(res.data.message);
          Swal.fire('Error!', errorMessage, 'error');
        } else {
          // toast.success(res.data.message);
          Swal.fire('Success!', res.data.message, 'success');
        }
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || err.message;
        // toast.error(errorMessage);
        Swal.fire('Error!', errorMessage, 'error');
      })
      .finally(() => setLoading(false));
  };

  const handlePinError = () => {
    setPin('');
  };

  const handlePurchase = () => {
    if (!selectedNetworkId || !phoneNumber || !amount) {
      toast.error('Please select a network, enter a phone number, and specify an amount.');
      return;
    }
    setIsModalOpen(true);
  };

  // Effect tocalculate adjusted amount (amount - 2%)
  useEffect(() => {
    if (amount) {
      const discount = (parseFloat(amount) * 0.015).toFixed(2); // Calculate 2% of the entered amount
      const adjusted = (parseFloat(amount) - parseFloat(discount)).toFixed(2); // Subtract 2% from the original amount
      setAdjustedAmount(adjusted);
    } else {
      setAdjustedAmount('');
    }
  }, [amount]);

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Airtime Purchase</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Select Network</label>
        <div className="flex justify-between">
        {networks.map(network => {
  const isSelected = selectedNetworkId === network.id;
  let bgColor, borderColor, hoverColor;

  // Dynamic styles based on the network name
  switch (network.name.toLowerCase()) {
    case 'mtn':
      bgColor = isSelected ? 'bg-yellow-500' : 'bg-yellow-200';
      borderColor = isSelected ? 'border-yellow-500' : 'border-transparent';
      hoverColor = 'hover:bg-yellow-400';
      break;
    case 'airtel':
      bgColor = isSelected ? 'bg-red-600' : 'bg-red-300';
      borderColor = isSelected ? 'border-red-600' : 'border-transparent';
      hoverColor = 'hover:bg-red-500';
      break;
    case '9mobile':
      bgColor = isSelected ? 'bg-green-600' : 'bg-green-300';
      borderColor = isSelected ? 'border-green-600' : 'border-transparent';
      hoverColor = 'hover:bg-green-500';
      break;
    default: // Glo
      bgColor = isSelected ? 'bg-vibrantGreen' : 'bg-green-200';
      borderColor = isSelected ? 'border-vibrantGreen' : 'border-transparent';
      hoverColor = '';
  }

  return (
    <div
      key={network.id}
      onClick={() => handleNetworkSelect(network.id)}
      className={`flex justify-center items-center h-20 w-20 rounded-xl cursor-pointer border-2 transition-transform duration-200 ${bgColor} ${borderColor} ${hoverColor} ${isSelected ? 'scale-105' : ''}`}
    >
      <img
        src={network.logo}
        alt={`${network.name} logo`}
        className={`w-12 h-12 ${network.name.toLowerCase() === 'mtn' ? 'w-16 h-16' : 'w-12 h-12'}`} // Adjust MTN logo size
      />
    </div>
  );
})}

        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          maxLength={11}
          placeholder={'phone number'}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          placeholder={'e.g 100'}
        />
      </div>

      {/* Display adjusted amount (amount - 2%) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">( 1.5% discount )</label>
        <input
          type="text"
          value={adjustedAmount}
          disabled
          className="w-full py-3 px-2 border rounded-md bg-gray-200"
        />
      </div>

      {/* Bypass Number Validator Checkbox */}
      {/* <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="bypassValidator"
          checked={bypassValidator}
          onChange={(e) => setBypassValidator(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="bypassValidator" className="text-gray-700">
          Bypass Number Validator
        </label>
      </div> */}

      <button
        onClick={handlePurchase}
        className={`w-full py-3 text-white font-semibold rounded-md ${loading ? 'bg-vibrantGreen' : 'bg-vibrantGreen'} hover:bg-green-600 transition`}
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-3 text-white inline" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        ) : 'Purchase'}
      </button>

      {/* Modal Overlay */}
      <PinPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pin={pin}
        setPin={setPin}
        onSuccess={handlePinSuccess}
        onError={handlePinError}
      />
    </div>
  );
};

export default AirtimePage;
