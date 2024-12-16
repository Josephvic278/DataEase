import React, { useEffect, useState } from 'react'; 
import authAxios from '@/api/authAxios';
// import { Toast } from 'react-toastify/dist/components';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createAuthAxios } from '@/api/authAxios';
const CreatVACC = () => {
  const authAxios = createAuthAxios()
  const navigate = useNavigate();

  useEffect(() => {
    authAxios.get('/virtual_account/')
      .then((res) => {
        // console.log(res.data.message);
        if (res.data.message != null) {
          // navigate('/dashboard')
        } else {
          
        }
      })
      .catch((err) => {
        console.log(false);
      });
  }, []);

  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('035'); // Default to Wema/Alat
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bvn, setBvn] = useState('');
  const [dob, setDOB] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  // Bank data
  const banks = [
    // { name: "Moniepoint", code: "035" },
    { name: "Wema", code: "035" },

    { name: "Providus", code: "101" },
    { name: "Access Bank", code: "044" }
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loader when form is submitted
    const formData = {
      bank,
      firstName,
      lastName,
      bvn,
      dob,
    };
    authAxios.post('/virtual_account/', formData)
      .then(res => {
        console.log('Success:', res.data);
        Swal.fire({
          title: 'Virtual account created successfully!',
          text: 'Visit your dashboard to view your account',
          icon: 'success',
        }).then(() => {
          // Navigate to dashboard only after the Swal popup is closed
          navigate('/dashboard');
        });

        setLoading(false); // Stop loader on success
      })
      .catch(err => {
        console.error(err.response?.data.message);
        toast.error(err.response?.data.message)  
        // if (err.response?.data.message.status == false){
        //   toast.error(err.response?.data.message.message)  
        // }
        setLoading(false); // Stop loader on error
      });
  };

  return (
    <div className="max-w-[74rem] mx-auto p-5 bg-white border border-vibrantGreen border-opacity-20 rounded-lg">
      <h1 className="text-2xl text-center lg:text-left text-slate-800 font-semibold mb-4">Create virtual account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Select Bank Dropdown */}
        <div>
          <label className="block text-neutral-800 font-medium mb-2">Select Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm bg-transparent"
          >
            {/* Map over banks to create option elements */}
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        {/* First Name Input */}
        <div>
          <label className="block text-neutral-800 font-medium mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name Input */}
        <div>
          <label className="block text-neutral-800 font-medium mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm"
            placeholder="Enter your last name"
          />
        </div>

        {/* BVN Input with maxLength */}
        <div>
          <label className="block text-neutral-800 font-medium mb-2">BVN</label>
          <input
            type="text"
            value={bvn}
            required
            onChange={(e) => setBvn(e.target.value)}
            maxLength="11"  // Set maximum length to 11
            className="w-full p-2 border rounded-md shadow-sm"
            placeholder="Enter your BVN"
          />
        </div>

          {/* Date of Birth Input */}
          <div>
          <label className="block text-neutral-800 font-medium mb-2">BVN</label>
          <input
            type="date"
            value={dob}
            required
            onChange={(e) => setDOB(e.target.value)}
            maxLength="11"  // Set maximum length to 11
            className="w-full p-2 border rounded-md shadow-sm"
            placeholder="Date of Birth"
          />
        </div>

        {/* NIN Input (only shows if GTBank is selected) */}
        {bank === 'GTBank' && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">NIN</label>
            <p className='text-sm -mt-3 mb-3 text-red-700'>*required for GTBank</p>
            <input
              type="text"
              value={nin}
              required
              onChange={(e) => setNin(e.target.value)}
              maxLength="11"
              className="w-full p-2 border rounded-md shadow-sm"
              placeholder="Enter your NIN"
            />
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full bg-vibrantGreen h-14 text-white p-2 rounded-md hover:bg-green-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit'} {/* Show loader text */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatVACC;
