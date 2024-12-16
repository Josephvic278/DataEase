import React, { useEffect, useState } from 'react';
import authAxios from '@/api/authAxios';
import { toast } from 'react-toastify';
import { createAuthAxios } from '@/api/authAxios';
import PinPopup from '@/components/Auth/PinPopup';
import Swal from 'sweetalert2';

const CablePage = () => {
  const authAxios = createAuthAxios();
  const [cables, setCables] = useState([]);
  const [selectedCable, setSelectedCable] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageDetails, setPackageDetails] = useState({});
  const [iucNumber, setIucNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [baseLoader, setBaseLoader] = useState(true)

  useEffect(() => {
    authAxios.post('/cable/', { action: 'get_cables' })
      .then(res => {
        setCables(res.data.message);
        // console.log(res.data.message);
        setBaseLoader(false)
      })
      .catch(err => console.error(err.response?.data || err.message));
  }, []);

  useEffect(() => {
    if (iucNumber.length === 10) {
      setLoading(true);
      authAxios.post('/cable/', {
        action: 'validate',
        vendor_id: selectedCable,
        account_number: iucNumber,
      })
      .then((res) => {
        const { status } = res.data;
        const customer_name = res.data.message
        if (status === 'success') {
          setAccountName(customer_name);
          toast.success('IUC number validated!');
        } else {
          setAccountName('');
          toast.error('Validation failed. Please check the IUC number.');
        }
      })
      .catch(err => {
        setAccountName('');
        toast.error(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
    } else if (iucNumber.length < 10) {
      setAccountName('');
      setLoading(false);
    }
  }, [iucNumber]);

  useEffect(() => {
    setAccountName('');
  }, [selectedCable]);

  const fetchCableDetails = (cableKey) => {
    setLoading(true);
    setAccountName('');
    authAxios.post('/cable/', { action: 'get_packages', vendor_id: cableKey })
      .then(res => {
        // console.log(res.data.message);
        setPackages(res.data.message);
        setSelectedPackage('');
        setPackageDetails({});
        setIucNumber('');
      })
      .catch(err => console.error(err.response?.data || err.message))
      .finally(() => setLoading(false));
  };

  const handleCableChange = (e) => {
    const selectedKey = e.target.value;
    setSelectedCable(selectedKey);
    fetchCableDetails(selectedKey);
  };

  const handlePackageChange = (e) => {
    const selectedPackageId = e.target.value;
    setSelectedPackage(selectedPackageId);

    const selectedPackageDetails = packages.find(pkg => pkg.id === parseInt(selectedPackageId));
    if (selectedPackageDetails) {
      setPackageDetails({
        price: parseInt(selectedPackageDetails.plan_amount) + 100,
        fee: parseInt(selectedPackageDetails.Fee) + 200
      });
    }
  };

  const handlePinSuccess = () => {
    setIsModalOpen(false);
    setLoading(true);

    authAxios.post('/cable/', {
      action: 'purchase',
      vendor_id: selectedCable,
      package_id: selectedPackage,
      account_number: iucNumber,
      account_name: accountName,
    })
    .then(res => {
      if (res.data.status === 'error') {
        toast.error(res.data.message.message);
        console.log(res)
      } else {
        const successMessage = res.response?.data?.message || res.message;
        // toast.success(res.data.message.message);
        Swal.fire('Success!', successMessage, 'success')
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || err.message;
      // toast.error(errorMessage);
      Swal.fire('Error!', errorMessage, 'error')
    })
    .finally(() => setLoading(false));
  };

  const handlePurchase = () => {
    if (!selectedCable || !selectedPackage || !iucNumber || !accountName) {
      toast.error('Please select a cable, package, enter and verify your IUC number.');
      return;
    }
    setIsModalOpen(true);
  };
  const handlePinError = () => {
    // setIsModalOpen(false);  // Close the modal
    setPin('');  // Reset the PIN
    // toast.error('Invalid PIN. Please try again.');
  }
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
      <h1 className="text-2xl font-semibold mb-4">Cable Subscription</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Cable Type</label>
        <select
          value={selectedCable}
          onChange={handleCableChange}
          className="w-full py-3 px-2 border rounded-md shadow-sm"
        >
          <option value="" disabled>Select a Cable</option>
          {cables.map((cable, index) => (
            <option key={index} value={Object.keys(cable)[0]}>
              {Object.values(cable)[0]}
            </option>
          ))}
        </select>
      </div>

      {packages.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Package</label>
          <select
            value={selectedPackage}
            onChange={handlePackageChange}
            className="w-full py-3 px-2 border rounded-md shadow-sm"
          >
            <option value="" disabled>Select a Package</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.package}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPackage && (
        <div className="bg-white p-4 rounded-md shadow-md mb-4">
          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Price</label>
            <input
              type="text"
              value={packageDetails.price || ''}
              disabled
              className="w-full py-3 px-2 border rounded-md"
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">IUC Number</label>
        <input
          type="text"
          value={iucNumber}
          onChange={(e) => setIucNumber(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          maxLength='10'
        />
      </div>

      {/* <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
        <input
          type="text"
          value={iucNumber}
          onChange={(e) => setIucNumber(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          maxLength='10'
        />
      </div> */}

      {accountName && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Account Name</label>
          <input
            type="text"
            value={accountName}
            disabled
            className="w-full py-3 px-2 border rounded-md bg-gray-200"
          />
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
      <PinPopup 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pin={pin}
        setPin={setPin}
        onSuccess={handlePinSuccess}
        onError={handlePinError}
      />
      </>  
      )}
    </div>
  );
};

export default CablePage;
