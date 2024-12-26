import React, { useEffect, useState, useRef } from 'react';
import { createAuthAxios } from '@/api/authAxios';
import html2canvas from 'html2canvas';

const RecieptPage = () => {
  const [reciept, setReciept] = useState([]);
  const [error, setError] = useState(null);
  const [type, setType] = useState('');
  const authAxios = createAuthAxios();
  const divRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reciept_id = urlParams.get('id');
    const type = urlParams.get('type');
    setType(type);

    authAxios
      .post('/purchases/', { action: 'reciept', id: reciept_id, type })
      .then((res) => {
        console.log(res.data.message);
        const data = Array.isArray(res.data.message) ? res.data.message : [res.data.message];
        setReciept(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load receipt details. Please try again later.');
      });
  }, []);

  const handleSaveAsImage = async (ref) => {
    if (divRef.current) {
      try {
        const canvas = await html2canvas(divRef.current);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${ref}.png`;
        link.click();
      } catch (err) {
        console.error('Failed to save receipt as an image', err);
      }
    }
  };

  return (
    <div className="justify-center flex items-center w-full">
      <div className="bg-slate-50  lg:w-96 w-80 rounded-3xl p-5" ref={divRef}>
        <div className="w-full flex justify-center">
          <div className="h-14 w-14 flex justify-center items-center bg-green-100 rounded-full">
            <i className="bx bxs-check-circle text-4xl text-green-500"></i>
          </div>
        </div>
        <div className="text-center mt-2">
          <h1 className="text-md font-medium text-gray">Payment Success!</h1>
          {error ? (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          ) : (
            <div className="mt-4">
              {reciept.length > 0 ? (
                reciept.map((data, index) => {
                  const parsedData = JSON.parse(data);
                  const dateObject = new Date(parsedData.date_created);
                  const formattedDate = dateObject.toLocaleDateString(); // Example: "12/6/2024"
                  const formattedTime = dateObject.toLocaleTimeString(); // Example: "10:00:00 AM"

                  return (
                    <div key={index} className="text-gray-700 text-sm">
                      {parsedData.credit_type == 'credit' ? (
                        <p className="font-bold text-3xl">₦{parsedData.amount}</p>
                      ) : (
                        <p className="font-bold text-3xl text-red-500">- ₦{parsedData.amount}</p>
                      )}
                      <hr className="mt-4" />
                      <div className="w-full mt-5 flex items-center justify-between">
                        <p className="text-left text-gray">Ref number</p>
                        <p className="font-medium">
                          {parsedData.reference || parsedData.reference_id}
                        </p>
                      </div>
                      <div className="w-full mt-5 flex items-center justify-between">
                        <p className="text-left text-gray">Payment time</p>
                        <p className="font-medium">{formattedDate} at {formattedTime}</p>
                      </div>
                      <div className="w-full mt-5 flex items-center justify-between">
                        <p className="text-left text-gray">Method</p>
                        <p className="font-medium">Wallet</p>
                      </div>
                      <div className="w-full mt-5 flex items-center justify-between">
                        <p className="text-left text-gray">Sender</p>
                        <p className="font-medium">{parsedData.user}</p>
                      </div>
                      <hr className="mt-4" />
                      <div className="w-full mt-5 flex items-center justify-between">
                        <p className="text-left text-gray">{type === 'fund' ? 'Remark' : 'Recipient'}</p>
                        <p className="font-medium">{type === 'fund' ? parsedData.remark : parsedData.mobile_number}</p>
                      </div>
                      <hr className="mt-4" />
                      <div className="w-full mt-5 flex items-center justify-between">
                        <p className="text-left text-gray">Amount</p>
                        <p className="font-medium">₦{parsedData.amount}</p>
                      </div>
                      {parsedData.network ? (
                        <div className="w-full mt-5 flex items-center justify-between">
                          <p className="text-left text-gray">Network</p>
                          <p className="font-medium">{parsedData.network}</p>
                        </div>
                      ) : (
                        <div className="w-full mt-5 flex items-center justify-between">
                          <p className="text-left text-gray">Amount</p>
                          <p className="font-medium">₦{parsedData.id}</p>
                        </div>
                      )}
                      {parsedData.plan && (
                        <div className="w-full mt-5 flex items-center justify-between">
                          <p className="text-left text-gray">Plan</p>
                          <p className="font-medium">{parsedData.plan}</p>
                        </div>
                      )}
                      <div className="w-full mt-5">
                        <button
                          className="bg-green-500 h-11 rounded-md w-full text-white font-bold text-sm"
                          onClick={() => handleSaveAsImage(parsedData.reference || parsedData.reference_id)}
                        >
                          Save Receipt
                        </button>
                      </div>
                      <p className='mt-2 text-gray text-xs'>*Screenshot or save the reciept</p>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-64">
                  <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecieptPage;
