import React, { useEffect, useState } from 'react';
import authAxios from '@/api/authAxios';
import { toast } from 'react-toastify';
import { createAuthAxios } from '@/api/authAxios';
import PinPopup from '@/components/Auth/PinPopup';

const EducationPage = () => {
  const authAxios = createAuthAxios()
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageDetails, setPackageDetails] = useState({});
  const [iucNumber, setIucNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    authAxios.post('/education/', { action: 'get_vendor' })
      .then(res => setVendors(res.data.message))
      .catch(err => console.error(err.response?.data || err.message));
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePinSuccess = () => {
    setIsModalOpen(false);
    setLoading(true);

    authAxios.post('/education/', {
      action: 'purchase',
      vendor_id: selectedVendor,
      package_id: selectedPackage,
      number: iucNumber
    })
    .then(res => {
      if (res.data.status === 'error') {
        toast.error(res.data.message.message);
      } else {
        toast.success(res.data.message.message);
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    })
    .finally(() => setLoading(false));
  };

  const handlePinError = () => {
    setPin('');
  };

  const fetchVendorPackages = (vendorId) => {
    setLoading(true);
    authAxios.post('/education/', { action: 'get_packages', vendor_id: vendorId })
      .then(res => {
        setLoading(false);
        setPackages(res.data.message.packages);
        setSelectedPackage('');
        setPackageDetails({});
      })
      .catch(err => {
        setLoading(false);
        console.error(err.response?.data || err.message);
      });
  };

  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    setSelectedVendor(vendorId);
    fetchVendorPackages(vendorId);
  };

  const handlePackageChange = (e) => {
    const packageId = e.target.value;
    setSelectedPackage(packageId);

    const packageInfo = packages.find(pkg => pkg.package === packageId);
    if (packageInfo) {
      setPackageDetails({
        price: (parseInt(packageInfo.price) +150),
        fee: (parseInt(packageInfo.Fee) + 200).toString()
      });
    }
  };

  const handlePurchase = () => {
    if (!selectedVendor || !selectedPackage) {
      toast.error('Please select a vendor and package.');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Education Subscription</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Select Vendor</label>
        <select
          value={selectedVendor}
          onChange={handleVendorChange}
          className="w-full py-3 px-2 border rounded-md shadow-sm"
        >
          <option value="" disabled>Select a Vendor</option>
          {vendors.map((vendor, index) => (
            <option key={index} value={Object.keys(vendor)[0]}>
              {Object.values(vendor)[0]}
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
              <option key={pkg.package} value={pkg.package}>
                {pkg.package_name}
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
              value={packageDetails.price}
              disabled
              className="w-full py-3 px-2 border rounded-md"
            />
          </div>
          {/* <div className="mb-2">
            <label className="block text-gray-700 font-medium">Fee</label>
            <input
              type="text"
              value={packageDetails.fee}
              disabled
              className="w-full py-3 px-2 border rounded-md"
            />
          </div> */}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Number</label>
        <input
          type="text"
          value={iucNumber}
          onChange={(e) => setIucNumber(e.target.value)}
          className="w-full py-3 px-2 border rounded-md"
          placeholder="Enter your JAMB or WAEC number"
        />
      </div>

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
        onClose={handleCloseModal}
        pin={pin}
        setPin={setPin}
        onSuccess={handlePinSuccess}
        onError={handlePinError}
      />
    </div>
  );
};

export default EducationPage;