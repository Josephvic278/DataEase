import React from 'react'
import 'boxicons/css/boxicons.min.css';

export const Plans = () => {
  return (
    <div className='mt-16'>
        <div className='text-center sm:text-left'>
        <h1 className=' text-3xl font-semibold'>
            Choose your plan
        </h1>
        <p className='mt-2 font-semibold'><i class='bx bxs-rocket text-vibrantGreen'></i> Enjor more benefits than a normal user</p>
        <p className='mt-3 text-gray'>Get the right plan for your business, personal use or <br />retail</p>
        </div>
        <div className='w-full grid grid-cols-1 gap-6 place-items-center  md:grid-cols-3 mt-10 mb-10'>
            <div className='w-96 shadow-spread px-5 py-12 transition-all duration-300 hover:scale-105 rounded-md bg-white h-auto'>
                <div className='text-md font-semibold'>
                <p><i class='bx bxs-star  text-green-700' ></i> Standard Plan</p>
                </div>
                <div className='mt-7 flex items-baseline'>
                    <h1 className='text-3xl font-bold'>₦ 4,000</h1><p className='text-gray ml-1'>/ lifetime</p>
                </div>
                <div className='mt-10'>
                    <p><i class="bx bxs-diamond p-2 text-vibrantGreen"></i>2% off Data purchase</p>
                    <p><i class="bx bxs-spa p-2 text-yellow-500"></i>2% off Airtime purchase</p>
                    <p><i class="bx bxs-shield-alt-2 p-2 text-red-600"></i>2% off Cable and Electricity purchase</p>
                    {/* <h1>hello</h1> */}
                </div>
                <div className='mt-12 justify-center items-center flex'>
                    <button className='h-14 w-full bg-white border-2 font-semibold text-vibrantGreen border-vibrantGreen rounded-md'>
                        Get Plan
                    </button>
                </div>
            </div>
            <div className='w-96 shadow-spread px-5 py-12 transition-all duration-300 hover:scale-105 rounded-md bg-white h-auto'>
                <div className='text-md font-semibold'>
                <p><i class="bx bxs-trophy text-purple-800"></i> Plus Plan</p>
                </div>
                <div className='mt-7 flex items-baseline'>
                    <h1 className='text-3xl font-bold'>₦ 9,000</h1><p className='text-gray ml-1'>/ lifetime</p>
                </div>
                <div className='mt-10'>
                    <p><i class="bx bxs-diamond p-2 text-vibrantGreen"></i>5% off Data purchase</p>
                    <p><i class="bx bxs-spa p-2 text-yellow-500"></i>5% off Airtime purchase</p>
                    <p><i class="bx bxs-shield-alt-2 p-2 text-red-600"></i>5% off Cable and Electricity purchase</p>
                </div>
                <div className='mt-12 justify-center items-center flex'>
                    <button className='h-14 w-full bg-vibrantGreen text-white font-semibold rounded-md'>
                        Get Plan
                    </button>
                </div>
            </div>
            <div className='w-96 shadow-spread px-5 py-12 transition-all duration-300 hover:scale-105 rounded-md bg-white h-auto'>
                <div className='text-md font-semibold'>
                <p><i class="bx bxs-crown text-sm text-blue-800"></i> Plus Plan</p>
                </div>
                <div className='mt-7 flex items-baseline'>
                <h1 className='text-3xl font-bold'>₦ 14,000</h1><p className='text-gray ml-1'>/ lifetime</p>
                </div>
                <div className='mt-10'>
                    <p><i class="bx bxs-diamond p-2 text-vibrantGreen"></i>7% off Data purchase</p>
                    <p><i class="bx bxs-spa p-2 text-yellow-500"></i>7% off Airtime purchase</p>
                    <p><i class="bx bxs-shield-alt-2 p-2 text-red-600"></i>7% off Cable and Electricity purchase</p>
                </div>
                <div className='mt-12 justify-center items-center flex'>
                    <button className='h-14 w-full bg-white border-2 font-semibold text-vibrantGreen border-vibrantGreen rounded-md'>
                        Get Plan
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}