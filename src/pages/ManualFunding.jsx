import React, { useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import Swal from 'sweetalert2';
import authAxios from '@/api/authAxios';
import { useNavigate } from 'react-router-dom';

const ManualFunding = () => {
  const navigate = useNavigate();
  const authAxios = createAuthAxios()
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('path', image);
    formData.append('action', 'manual_funding');

    authAxios.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      console.log('Success:', res.data);
      setLoading(false);
      Swal.fire({
        title: 'Upload successfull!',
        text: `Your reciept has been uploaded successfully your reference id: #${res.data.reference_id}`,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect to the desired page
        navigate('/dashboard'); // Replace with your actual route path
      });  
    })
    .catch((err) => {
      console.error(err.data);
      setLoading(false);
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  return (
    <div className="max-w-[74rem] mx-auto p-5 bg-white border border-vibrantGreen border-opacity-30 rounded-lg">
      <h1 className="text-2xl text-center lg:text-left font-semibold mb-4">Manual Funding</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Amount Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            required
            onChange={(e) => setAmount(e.target.value)}
            className="w-full lg:w-[70%] p-2 border rounded-md shadow-sm"
            placeholder="Enter amount"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full lg:w-[70%] p-2 border rounded-md shadow-sm"
          />
        </div>
        <div className="mt-2">
        <p><b>Account Number:</b> 6104930954</p>
        <p><b>Account Name:</b> Ifeanyi Emmanuel Chukwu</p>
        <p><b>Bank Name:</b> OPAY</p>
        </div>
        <div className="mt-2">
        <p><b>Account Number:</b> 2551622283</p>
        <p><b>Account Name:</b>Chukwu Ifeanyi Emmanuel</p>
        <p><b>Bank Name:</b> ZENITH BANK</p>
        </div>
        <p className='text-center text-sm text-gray'>*Enter an amount and upload a screenshot of your receipt.</p>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 bg-vibrantGreen text-white p-2 rounded-md hover:bg-green-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualFunding;
