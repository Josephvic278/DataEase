import React, { useEffect, useState } from 'react'; 
import authAxios from '@/api/authAxios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createAuthAxios } from '@/api/authAxios';

const CreatVACC = () => {
  const authAxios = createAuthAxios();
  const navigate = useNavigate();

  useEffect(() => {
    authAxios.get('/virtual_account/')
      .then((res) => {
        if (res.data.message != null) {
          navigate('/dashboard')
        } else {
          
        }
      })
      .catch((err) => {
        console.log(false);
      });
  }, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bvn, setBvn] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loader when form is submitted
    const formData = {
      firstName,
      lastName,
      bvn,
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
        toast.error(err.response?.data.message);
        setLoading(false); // Stop loader on error
      });
  };

  return (
    <div className="max-w-[74rem] mx-auto p-5 bg-white border border-vibrantGreen border-opacity-20 rounded-lg">
      <h1 className="text-2xl text-center lg:text-left text-slate-800 font-semibold mb-4">Create virtual account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

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
