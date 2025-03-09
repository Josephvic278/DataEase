import React, { useState, useEffect } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import { toast } from 'react-toastify';
import 'boxicons';
import Mtn from '@/assets/mtn.svg';
import mobile from '@/assets/9mobile.svg';
import Airtel from '@/assets/airtel.svg';
import Glo from '@/assets/glo.svg';
import PinPopup from '@/components/Auth/PinPopup';
import Swal from 'sweetalert2';

const DataPage = () => {
  const authAxios = createAuthAxios();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dataType, setDataType] = useState('');
  const [amount, setAmount] = useState(0.0);
  const [monthValidate, setMonthValidate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataTypes, setDataTypes] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for overlay loading
  const extractPlanSizeInGB = (plan) => {
    const match = plan.match(/(\d+(\.\d+)?)\s*(GB|TB|MB)/i);
    if (!match) return 0; // Default to 0 if no match
  
    const size = parseFloat(match[1]);
    const unit = match[3].toUpperCase();
  
    // Convert size to GB
    if (unit === 'TB') return size * 1024;
    if (unit === 'MB') return size / 1024;
    return size; // Already in GB
  };
  const handleAutoFill = () => setPhoneNumber(JSON.parse(localStorage.getItem("user")).phone_number);

  const handlePay = () => {
    if (!selectedNetwork || !phoneNumber || !selectedPlan || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePinSuccess = () => {
    setIsModalOpen(false);
    setLoading(true);

    const requestBody = {
      network: selectedNetwork.id,
      phone_number: phoneNumber,
      plan_id: selectedPlan.dataplan_id,
      action: 'purchase',
      data_type: dataType
    };

    authAxios.post('/data/', requestBody)
      .then(res => {
        if (res.data.status === 'error') {
          toast.error(res.data.message);
        } else {
          // toast.success(res.data.message);
          Swal.fire('Success!', res.data.message, 'success')
        }
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || err.message;
        // toast.error(errorMessage);
        Swal.fire('Error!', errorMessage, 'error');
      })
      .finally(() => setLoading(false));
  };

  const handlePinError = () => setPin('');

  const networks = [
    { id: '1', name: 'MTN', logo: Mtn },
    { id: '2', name: 'AIRTEL', logo: Airtel },
    { id: '3', name: '9MOBILE', logo: mobile },
    { id: '4', name: 'GLO', logo: Glo },
  ];

  useEffect(() => {
    if (selectedNetwork) {
      setDataType(''); // Reset data type when network changes
      setSelectedPlan(null); // Reset selected plan when network changes
      setAmount(0); // Reset amount when network changes
      setMonthValidate(''); // Reset month validation when network changes
      setIsLoading(true); // Start loading when network is selected
  
      authAxios.post(`/data/`, { action: 'network_data', network_id: selectedNetwork.id })
        .then(res => {
          if (res.data.status === 'success') {
            const networkData = res.data.message[selectedNetwork.name] || {};
            setDataTypes(Object.keys(networkData));
            setDataPlans([]); // Reset plans when network changes
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || err.message;
          toast.error(errorMessage);
        })
        .finally(() => setIsLoading(false)); // End loading after response
    }
  }, [selectedNetwork]);  

  useEffect(() => {
    if (dataType && selectedNetwork) {
      setIsLoading(true); // Start loading for data plans
      authAxios.post(`/data/`, { action: 'get_plans', network_id: selectedNetwork.id, data_type: dataType })
        .then(res => {
          if (res.data.status === 'success') {
            setDataPlans(res.data.message);
            const defaultPlan = res.data.message[0]; // Set default plan to the first option
            setSelectedPlan(defaultPlan);
            const percentage = parseFloat(defaultPlan.plan_amount)*0.05
            console.log(percentage)
            Math.ceil(percentage)
            setAmount(parseFloat(defaultPlan.plan_amount)+percentage);
            setMonthValidate(defaultPlan.month_validate);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || err.message;
          toast.error(errorMessage);
        })
        .finally(() => setIsLoading(false)); // End loading after response
    }
  }, [dataType, selectedNetwork]);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  
    // Extract the plan size in GB
    const planSizeInGB = extractPlanSizeInGB(plan.plan_name);
  
    // Determine additional cost and size 
    const additionalCost = planSizeInGB >= 5 ? 15 : 8;
  
    // Update amount and month validation
    setAmount(parseFloat(plan.plan_amount) + additionalCost);
    setMonthValidate(plan.month_validate);
  };
  const data_vendor = 'subsizi'
  // const data_vendor = 'mypayconnect'

    // Utility function to extract plan size
  const getPlanSize = (plan) => {
    const match = plan.match(/\b\d+(\.\d+)?\s?(MB|GB|TB)\b/i);
    return match ? match[0] : plan;
  };

  // for the subizi part
  const [selectedNetwork1, setSelectedNetwork1] = useState(null);
  // const [phoneNumber1, setPhoneNumber1] = useState('');
  const [selectedPlan1, setSelectedPlan1] = useState(null);
  const [dataType1, setDataType1] = useState('');
  const [amount1, setAmount1] = useState(0.0);
  const [monthValidate1, setMonthValidate1] = useState('');
  const [isLoading1, setIsLoading1] = useState(false); 
  const [loading1, setLoading1] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [pin1, setPin1] = useState('');
  const [isPortedNumber, setIsPortedNumber] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [dataTypes1, setDataTypes1] = useState([]);
  const [dataPlans1, setDataPlans1] = useState([]);
  const handlePlanChange1 = (plan) => {
    setSelectedPlan1(plan);
  
    // Extract the plan size in GB
    const planSizeInGB = extractPlanSizeInGB(plan.plan_name);
  
    // Determine additional cost based on network and plan size
    let additionalCost;
    switch (selectedNetwork1.name) {
      case 'MTN':
        if (planSizeInGB < 0.5) {
          additionalCost = 5;
        } else if (planSizeInGB < 1) {
          additionalCost = 8;
        } else if (planSizeInGB < 2) {
          additionalCost = 8;
        } else if (planSizeInGB < 3) {
          additionalCost = 10;
        } else if (planSizeInGB < 5) {
          additionalCost = 10;
        } else if (planSizeInGB < 6) {
          additionalCost = 30;
        }
        else if (planSizeInGB < 10) {
          additionalCost = 25;
        } else {
          additionalCost = 30;
        }
        break;
      case 'AIRTEL':
        if (planSizeInGB < 0.5) {
          additionalCost = 8;
        } else if (planSizeInGB < 1) {
          additionalCost = 9;
        } else if (planSizeInGB < 2) {
          additionalCost = 8;
        } else if (planSizeInGB < 5) {
          additionalCost = 10;
        } else if (planSizeInGB < 10) {
          additionalCost = 30;
        } else {
          additionalCost = 40;
        }
        break;
      case '9MOBILE':
        if (planSizeInGB < 0.5) {
          additionalCost = 7;
        } else if (planSizeInGB < 1) {
          additionalCost = 10;
        } else if (planSizeInGB < 2) {
          additionalCost = 15;
        } else if (planSizeInGB < 5) {
          additionalCost = 20;
        } else if (planSizeInGB < 10) {
          additionalCost = 30;
        } else {
          additionalCost = 35;
        }
        break;
      case 'GLO':
        if (planSizeInGB < 0.5) {
          additionalCost = 8;
        } else if (planSizeInGB < 1) {
          additionalCost = 8;
        } else if (planSizeInGB < 2) {
          additionalCost = 10;
        } else if (planSizeInGB < 5) {
          additionalCost = 10;
        } else if (planSizeInGB < 10) {
          additionalCost = 30;
        } else {
          additionalCost = 30;
        }
        break;
      default:
        additionalCost = 8; // Default additional cost
    }
  
    // Update amount and month validation
    setAmount1(parseFloat(plan.plan_amount) + additionalCost);
    setMonthValidate1(plan.month_validate);
  };

  const networks1 = [
    { id: '1', name: 'MTN', logo: Mtn },
    { id: '2', name: 'AIRTEL', logo: Airtel },
    { id: '3', name: '9MOBILE', logo: mobile },
    { id: '4', name: 'GLO', logo: Glo },
  ];

  // List of available data sizes for each network and data type
  const availableDataSizes = {
    MTN: {
      GIFTING: [ '1.0GB', '5.0GB',],
      SME: ['500MB', '1GB', '2GB', '5GB', '*'],
      AWOOF: ['1.5GB', '5.0GB',]
    },
    AIRTEL: {
      CORPORATE_GIFTING: ['100.0MB', '300.0MB','500.0MB', '1.0GB', '2.0GB', '5.0GB', '10.0GB', '*'],
      AWOOF: ['1.5GB', '150.0MB', '300.0MB', '500.0MB', '3.0GB', '5.0GB', '10.0GB',]
    },
    '9MOBILE': {
      CORPORATE_GIFTING: ['500MB', '1GB', '2GB', '5GB', '10GB', '*']
    },
    GLO: {
      CORPORATE_GIFTING: ['500MB', '1GB', '2GB', '5GB', '10GB', '*'],
      GIFTING: ['500MB', '1GB', '2GB', '5GB', '10GB', '*']
    }
  };

  // Configuration for available data types per network
  const networkDataTypesConfig = {
    //mtn 'DATA COUPONS', 'GIFTING', 'SME', 'SME 2', 'DATA SHARE', 'AWOOF'
    // airtel 'DATA COUPONS', 'GIFTING', 'SME', 'DATA SHARE',
    MTN: ['GIFTING', 'SME' ],
    AIRTEL: ['AWOOF'],
    '9MOBILE': [ 'CORPORATE GIFTING',],
    GLO: ['CORPORATE GIFTING','GIFTING',]
  };

  if (data_vendor === 'subsizi') {
    useEffect(() => {
      if (selectedNetwork1) {
        // Reset all relevant states when network changes
        setAmount1(0);
        setSelectedPlan1(null);
        setMonthValidate1('');
        setDataType1(''); // Clear data type
        setDataPlans1([]); // Clear data plans
        setDataTypes1([]); // Clear available data types
        setIsLoading1(true);
  
        authAxios
          .post(`/data/`, { action: 'data_info', network: selectedNetwork1.name })
          .then((res) => {
            const networkData1 = res.data.message;
            setDataTypes1(Object.keys(networkData1)); // Set available data types
            // console.log(selectedNetwork1.name);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsLoading1(false);
          });
      }
    }, [selectedNetwork1]);
  
    useEffect(() => {
      if (dataType1 && selectedNetwork1) {
        // console.log(dataType1);
        setIsLoading1(true);
        authAxios
          .post('/data/', {
            action: 'get_plans',
            network: selectedNetwork1.name,
            data_type: dataType1,
          })
          .then((res) => {
            setDataPlans1(res.data.message);
            setSelectedPlan1(null); // User must manually select a plan
            setAmount1(0); // Reset amount
            setMonthValidate1(''); // Reset month validation
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsLoading1(false);
          });
      }
    }, [dataType1, selectedNetwork1]);
  }  

  // the pin and payment section for subsizi
  const handlePay1 = () => {
    if (!selectedNetwork1 || !phoneNumber || !selectedPlan1) {
      // console.log(phoneNumber1)
      toast.error('Please fill in all required fields');
      return;
    }
    setIsModalOpen1(true);
  };

  const handleCloseModal1 = () => setIsModalOpen1(false);

  const handlePinSuccess1 = () => {
    setIsModalOpen1(false);
    setLoading1(true);

    const requestBody = {
      network: selectedNetwork1.id,
      phone_number: phoneNumber,
      plan_id: selectedPlan1.plan_id,
      action: 'purchase',
      data_type: dataType1,
      plan: selectedPlan1,
      ported_number: isPortedNumber // Add ported_number argument
    };

    authAxios.post('/data/', requestBody)
      .then(res => {
        if (res.data.status === 'error') {
          toast.error(res.data.message);
        } else {
          // toast.success(res.data.message);
          Swal.fire('Success!', res.data.message, 'success')
        }
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || err.message;
        // toast.error(errorMessage);
        Swal.fire('Error!', errorMessage, 'error');
      })
      .finally(() => setLoading1(false));
  };

  const handlePinError1 = () => setPin('');
  return (
    <div>
      {data_vendor == 'mypayconnect'?(
      <div className="w-full flex px-2 items-center justify-center">
      <div className="p-5 w-full bg-white border border-grey border-opacity-30 rounded-lg">
        <div className="w-full flex items-center gap-6 mb-2">
          <h1 className="text-2xl font-semibold text-black">Buy Data</h1>
        </div>

        <div className="mb-9">
          <h2 className="text-lg text-left font-semibold">Select Network</h2>
          <div className="flex space-x-6 mt-5">
          {networks.map(network => {
            const isSelected = selectedNetwork?.id === network.id;
            let bgColor, hoverColor;

            switch (network.name) {
              case 'MTN':
                bgColor = isSelected ? 'bg-yellow-500' : 'bg-yellow-200';
                hoverColor = 'hover:bg-yellow-400';
                break;
              case 'AIRTEL':
                bgColor = isSelected ? 'bg-red-600' : 'bg-red-300';
                hoverColor = 'hover:bg-red-500';
                break;
              case '9MOBILE':
                bgColor = isSelected ? 'bg-green-600' : 'bg-green-300';
                hoverColor = 'hover:bg-green-500';
                break;
              default:
                bgColor = isSelected ? 'bg-green-500 border-green-500' : 'bg-vibrantGreen bg-opacity-30';
                hoverColor = '';
            }

            return (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network)}
                className={`flex justify-center items-center h-18 w-20 rounded-lg cursor-pointer border-2 transition-transform duration-200 ${bgColor} ${hoverColor} ${isSelected ? 'scale-105' : ''}`}
              >
                <img src={network.logo} alt={`${network.name} logo`} className={`${network.name === 'MTN' ? 'w-16 h-16' : 'w-12 h-12'}`} />
              </button>
            );
          })}

          </div>
        </div>

        <div className="mb-9">
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter number"
              value={phoneNumber}
              maxLength={11}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-3 py-2 h-14 outline-none"
            />
            <button
              onClick={handleAutoFill}
              className="px-4 h-14 py-2 bg-green-500 text-white font-semibold hover:bg-green-600"
            >
              Me
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Data Type</h2>
          <select
            onChange={(e) => setDataType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 h-14 outline-none"
            value={dataType}
            disabled={isLoading} // Disable dropdown during loading
          >
            <option value="" disabled>Select a data type</option>
            {dataTypes
              .filter((type) => networkDataTypesConfig[selectedNetwork?.name]?.includes(type))
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Data Plan</h2>
          <select
            onChange={(e) => {
              const selectedPlan = dataPlans.find(plan => plan.dataplan_id === e.target.value);
              handlePlanChange(selectedPlan);
            }}
            className="w-full border rounded-lg px-3 py-2 h-14 outline-none"
            value={selectedPlan?.dataplan_id || ''}
            disabled={isLoading} // Disable dropdown during loading
          >
            <option value="" disabled>Select a plan</option>
            {dataPlans
              .filter((plan) => availableDataSizes[selectedNetwork?.name]?.[dataType]?.includes(getPlanSize(plan.plan)) || availableDataSizes[selectedNetwork?.name]?.[dataType]?.includes('*')) // Filter plans based on available data sizes
              .map((plan) => (
                <option key={plan.dataplan_id} value={plan.dataplan_id}>
                  {getPlanSize(plan.plan)} {/* Display only the plan size */}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            className="w-full border rounded-lg px-3 h-14 py-2 outline-none"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Month Validation</label>
          <input
            type="text"
            value={monthValidate}
            disabled
            className="w-full border rounded-lg px-3 h-14 py-2 outline-none"
          />
        </div>

        <button
          onClick={handlePay}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291l1.528 1.79A8.002 8.002 0 014 12H2c0 3.166 1.355 6.02 3.5 8.037l.5-.746z"></path>
            </svg>
          ) : 'Purchase'}
        </button>

        {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <svg className="animate-spin h-12 w-12 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      )}
      </div>

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
    ):(
      <div className="w-full flex px-2 items-center justify-center">
      <div className="p-5 w-full bg-white border border-grey border-opacity-30 rounded-lg">
        <div className="w-full flex items-center gap-6 mb-2">
          <h1 className="text-2xl font-semibold text-black">Buy Data</h1>
        </div>

        <div className="mb-9">
          <h2 className="text-lg text-left font-semibold">Select Network</h2>
          <div className="flex space-x-6 mt-5">
          {networks1.map(network => {
            const isSelected1 = selectedNetwork1?.id === network.id;
            let bgColor, hoverColor;

            switch (network.name) {
              case 'MTN':
                bgColor = isSelected1 ? 'bg-yellow-500' : 'bg-yellow-200';
                hoverColor = 'hover:bg-yellow-400';
                break;
              case 'AIRTEL':
                bgColor = isSelected1 ? 'bg-red-600' : 'bg-red-300';
                hoverColor = 'hover:bg-red-500';
                break;
              case '9MOBILE':
                bgColor = isSelected1 ? 'bg-green-600' : 'bg-green-300';
                hoverColor = 'hover:bg-green-500';
                break;
              default:
                bgColor = isSelected1 ? 'bg-green-500 border-green-500' : 'bg-vibrantGreen bg-opacity-30';
                hoverColor = '';
            }

            return (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork1(network)}
                className={`flex justify-center items-center h-18 w-20 rounded-lg cursor-pointer border-2 transition-transform duration-200 ${bgColor} ${hoverColor} ${isSelected1 ? 'scale-105' : ''}`}
              >
                <img src={network.logo} alt={`${network.name} logo`} className={`${network.name === 'MTN' ? 'w-16 h-16' : 'w-12 h-12'}`} />
              </button>
            );
          })}

          </div>
        </div>

        <div className="mb-9">
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter number"
              value={phoneNumber}
              maxLength={11}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-3 py-2 h-14 outline-none"
            />
            <button
              onClick={handleAutoFill}
              className="px-4 h-14 py-2 bg-green-500 text-white font-semibold hover:bg-green-600"
            >
              Me
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Data Type</h2>
          <select
            onChange={(e) => setDataType1(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 h-14 outline-none"
            value={dataType1}
            disabled={isLoading1} // Disable dropdown during loading
          >
            <option value="" disabled>Select a data type</option>
            {dataTypes1
              .filter((type) => networkDataTypesConfig[selectedNetwork1?.name]?.includes(type))
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Data Plan</h2>
          <select
            onChange={(e) => {
              const selectedPlan1 = dataPlans1.find(plan => plan.plan_id === e.target.value);
              handlePlanChange1(selectedPlan1);
            }}
            className="w-full border rounded-lg px-3 py-2 h-14 outline-none"
            value={selectedPlan1?.plan_id || ''}
            disabled={isLoading} // Disable dropdown during loading
          >
            <option value="" disabled>Select a plan</option>
            {dataPlans1
              .filter((plan) => availableDataSizes[selectedNetwork1?.name]?.[dataType1]?.includes(getPlanSize(plan.plan_name)) || availableDataSizes[selectedNetwork1?.name]?.[dataType1]?.includes('*')) // Filter plans based on available data sizes
              .map((plan) => (
                <option key={plan.plan_id} value={plan.plan_id}>
                  {plan.plan_name} {/* Display only the plan size */}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Amount</label>
          <input
            type="number"
            value={amount1}
            className="w-full border rounded-lg px-3 h-14 py-2 outline-none"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Month Validation</label>
          <input
            type="text"
            value={monthValidate1}
            disabled
            className="w-full border rounded-lg px-3 h-14 py-2 outline-none"
          />
        </div>
        
        <div className='flex mb-4'>
          <p>Ported number</p>
          <input 
            type="checkbox" 
            className='ml-2'
            checked={isPortedNumber}
            onChange={(e) => setIsPortedNumber(e.target.checked)}
          />
        </div>
        <button
          onClick={handlePay1}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
          disabled={loading1} // Disable button when loading
        >
          {loading1 ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291l1.528 1.79A8.002 8.002 0 014 12H2c0 3.166 1.355 6.02 3.5 8.037l.5-.746z"></path>
            </svg>
          ) : 'Purchase'}
        </button>

        {isLoading1 && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <svg className="animate-spin h-12 w-12 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      )}
      </div>

      {/* Modal Overlay */}
      <PinPopup 
          isOpen={isModalOpen1}
          onClose={handleCloseModal1}
          pin={pin1}
          setPin={setPin1}
          onSuccess={handlePinSuccess1}
          onError={handlePinError1}
        />
    </div>
    )}
    </div>
  );
};

export default DataPage;
