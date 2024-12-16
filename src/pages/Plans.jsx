import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'boxicons/css/boxicons.min.css';
import { createAuthAxios } from '@/api/authAxios';
import { useNavigate } from 'react-router-dom';

export const Plans = () => {
    const authAxios = createAuthAxios();
    const navigate = useNavigate();
    const [currentPlan, setCurrentPlan] = useState(''); // State to hold the current plan

    useEffect(() => {
        authAxios.get('/plan/')
            .then((res) => {
                // Assuming res.data.message contains the current plan type (e.g., 'Standard', 'Pro', 'Plus')
                setCurrentPlan(res.data.message); // Set the current plan
            })
            .catch((error) => {
                console.error('Error fetching current plan:', error);
            });
    }, []);

    const Upgrade = (type) => {
        Swal.fire({
            title: `Are you sure you want to purchase the ${type} plan?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, purchase it!'
        }).then((result) => {
            if (result.isConfirmed) {
                authAxios.post('/plan/', { 'plan': type })
                    .then((res) => {
                        console.log(res);
                        Swal.fire(
                            'Purchased!',
                            `You have successfully purchased the ${type} plan.`,
                            'success'
                        ).then(() => {
                            setCurrentPlan(type); // Update current plan after successful purchase
                            navigate('/dashboard'); // Redirect to dashboard
                        });
                    })
                    .catch((error) => {
                        console.error(error.response.data.message);
                        Swal.fire(
                            'Error',
                            error.response.data.message,
                            'error'
                        );
                    });
            }
        });
    };

    return (
        <div className='mt-20'>
            <div className='text-center sm:text-left'>
                <h1 className='text-3xl font-semibold'>
                    Upgrade your Account
                </h1>
                <p className='mt-2 font-semibold'><i className='bx bxs-rocket text-vibrantGreen'></i> Enjoy more benefits than a normal user</p>
                <p className='mt-3 text-gray'>Get the right plan for your business, personal use or <br />retail</p>
            </div>
            <p className='ml-4'>Current Plan: <span className='font-semibold text-vibrantGreen'>{currentPlan || 'Not available'}</span></p>
            <div className='w-full grid grid-cols-1 gap-6 place-items-center md:grid-cols-3 mt-10 mb-10'>
                {/* Standard Plan */}
                <div className='w-96 shadow-spread px-5 py-12 transition-all duration-300 hover:scale-105 rounded-md bg-white h-auto'>
                    <div className='text-md font-semibold'>
                        <p><i className='bx bxs-star text-green-700'></i> Standard Plan</p>
                    </div>
                    <div className='mt-7 flex items-baseline'>
                        <h1 className='text-3xl font-bold'>₦ 4,000</h1><p className='text-gray ml-1'>/ lifetime</p>
                    </div>
                    <div className='mt-10'>
                        <p><i className='bx bxs-diamond p-2 text-vibrantGreen'></i>2% off Data purchase</p>
                        <p><i className='bx bxs-spa p-2 text-yellow-500'></i>2% off Airtime purchase</p>
                        <p><i className='bx bxs-shield-alt-2 p-2 text-red-600'></i>2% off Cable and Electricity purchase</p>
                    </div>
                    <div className='mt-12 justify-center items-center flex'>
                        <button className='h-14 w-full bg-white border-2 font-semibold text-vibrantGreen border-vibrantGreen rounded-md'
                            onClick={() => Upgrade('standard')}>
                            Get Plan
                        </button>
                    </div>
                </div>
                
                {/* Pro Plan */}
                <div className='w-96 shadow-spread px-5 py-12 transition-all duration-300 hover:scale-105 rounded-md bg-white h-auto'>
                    <div className='text-md font-semibold'>
                        <p><i className='bx bxs-trophy text-purple-800'></i> Pro Plan</p>
                    </div>
                    <div className='mt-7 flex items-baseline'>
                        <h1 className='text-3xl font-bold'>₦ 9,000</h1><p className='text-gray ml-1'>/ lifetime</p>
                    </div>
                    <div className='mt-10'>
                        <p><i className='bx bxs-diamond p-2 text-vibrantGreen'></i>5% off Data purchase</p>
                        <p><i className='bx bxs-spa p-2 text-yellow-500'></i>5% off Airtime purchase</p>
                        <p><i className='bx bxs-shield-alt-2 p-2 text-red-600'></i>5% off Cable and Electricity purchase</p>
                    </div>
                    <div className='mt-12 justify-center items-center flex'>
                        <button className='h-14 w-full bg-vibrantGreen text-white font-semibold rounded-md'
                            onClick={() => Upgrade('pro')}>
                            Get Plan
                        </button>
                    </div>
                </div>
                
                {/* Plus Plan */}
                <div className='w-96 shadow-spread px-5 py-12 transition-all duration-300 hover:scale-105 rounded-md bg-white h-auto'>
                    <div className='text-md font-semibold'>
                        <p><i className='bx bxs-crown text-sm text-blue-800'></i> Plus Plan</p>
                    </div>
                    <div className='mt-7 flex items-baseline'>
                        <h1 className='text-3xl font-bold'>₦ 14,000</h1><p className='text-gray ml-1'>/ lifetime</p>
                    </div>
                    <div className='mt-10'>
                        <p><i className='bx bxs-diamond p-2 text-vibrantGreen'></i>7% off Data purchase</p>
                        <p><i className='bx bxs-spa p-2 text-yellow-500'></i>7% off Airtime purchase</p>
                        <p><i className='bx bxs-shield-alt-2 p-2 text-red-600'></i>7% off Cable and Electricity purchase</p>
                    </div>
                    <div className='mt-12 justify-center items-center flex'>
                        <button className='h-14 w-full bg-white border-2 font-semibold text-vibrantGreen border-vibrantGreen rounded-md'
                            onClick={() => Upgrade('plus')}>
                            Get Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
