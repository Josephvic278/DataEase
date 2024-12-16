import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { createAuthAxios } from '@/api/authAxios';
import PinPopup from '@/components/Auth/PinPopup';
import Swal from 'sweetalert2';

const ElectricityPage = () => {
  const authAxios = createAuthAxios();
  const [discos, setDiscos] = useState([]);
  const [selectedDisco, setSelectedDisco] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [customerDetails, setCustomerDetails] = useState({});
  const [meterType, setMeterType] = useState('');
  const [amount, setAmount] = useState(1000);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [baseLoader, setBaseLoader] = useState(true)
  
  useEffect(() => {
    authAxios.get('/electricity/')
      .then((res) => {
        const discoList = res.data.message;
        setDiscos(discoList);
        setBaseLoader(false)
      })
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);

  const handleProviderChange = (e) => {
    const selectedDiscoId = e.target.value;
    setSelectedDisco(selectedDiscoId);
    setCustomerDetails({});
    setMeterNumber('');
  };

  const verifyMeterNumber = () => {
    if (!meterNumber || meterNumber.length !== 13 || !selectedDisco || !meterType) {
      toast.error('Ensure you Enter a valid meter number, select a disco and select a meter type.');
      return;
    }
    setLoading(true)
    authAxios.post('/electricity/', { meter_number: meterNumber, disco_id: selectedDisco, action:'validate_meter', meter_typ:meterType})
      .then((res) => {
        // setCustomerDetails(res.data.message);
        setCustomerAddress(res.data.message.address)
        setCustomerName(res.data.message.name)
        toast.success('Meter number verified successfully.');
        setLoading(false)
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to verify meter number.');
        setLoading(false)
      });
  };

  const handlePurchase = () => {
    if (!selectedDisco || !meterNumber || meterNumber.length !== 13 || !meterType || !customerPhone || amount < 1000 || !customerName || !customerAddress) {
      toast.error('Please fill in all required fields with valid data.');
      return;
    }
    setIsModalOpen(true);
  };

  const handlePinSuccess = () => {
    setIsModalOpen(false);
    setLoading(true);

    authAxios.post('/electricity/', {
      action: 'purchase',
      disco_id: selectedDisco,
      meter_number: meterNumber,
      meter_type: meterType,
      amount,
      customer_phone: customerPhone,
      customer_name: customerName,
      customer_address: customerAddress,
    })
      .then((res) => {
        if (res.data.status === 'error') {
          toast.error(res.data.message);
        } else {
          const successMessage = res.response?.data?.message || res.message;
          // toast.success(res.data.message.message);
          Swal.fire('Success!', successMessage, 'success')
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message
        Swal.fire('Error!', errorMessage, 'error')
        // toast.error();
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
    {baseLoader ?(
      <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
    ):(
      <>
      <h1 className="text-2xl font-semibold mb-4">Electricity Bill Purchase</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">State Provider</label>
        <select
        value={selectedDisco}
        onChange={handleProviderChange}
        className="w-full py-3 px-2 border rounded-md shadow-sm"
      >
        <option value="" disabled>Select a Disco</option>
        {discos.map((disco) => (
          <option key={disco.id} value={disco.id}>{disco.name}</option>
        ))}
      </select>

      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Meter Type</label>
        <select
          value={meterType}
          onChange={(e) => setMeterType(e.target.value)}
          className="w-full py-3 px-2 border rounded-md shadow-sm"
        >
          <option value="" disabled>Select Meter Type</option>
          <option value="Prepaid">Prepaid</option>
          <option value="Postpaid">Postpaid</option>
        </select>
      </div>

      <div className="">
        <label className="block text-gray-700 font-medium mb-2">Meter Number</label>
        <input
          type="text"
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          maxLength="13"
          className="w-full py-3 px-2 border rounded-md"
          placeholder='Enter your meter number eg.012xxxxxxxxx'
        />
        <p
          className="text-blue-600 text-right text-xs mt-2 cursor-pointer"
          onClick={verifyMeterNumber}
        >
          Verify meter number
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          min="1000"
          placeholder='Minimum amount ₦1000'
        />
      </div>
      <p className='text-red-700 -m-2 mb-3 ml-1 text-xs'>charge: ₦100</p>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          placeholder='Enter your phone number'
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Customer Address</label>
        <input
          type="text"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          disabled
        />
      </div>

      {customerDetails.name && (
        <div className="bg-white p-4 rounded-md shadow-md mb-4">
          <p><strong>Name:</strong> {customerDetails.name}</p>
          <p><strong>Address:</strong> {customerDetails.address}</p>
        </div>
      )}

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
      <p className='mt-2 text-center text-gray text-xs'>*if you encounter any problem purchasing this product feel free to contact the support team</p>

      <PinPopup 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pin={pin}
        setPin={setPin}
        onSuccess={handlePinSuccess}
      />
      </>
    )}
    </div>
  );
};

export default ElectricityPage;
