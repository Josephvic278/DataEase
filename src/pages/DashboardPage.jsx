import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation to settings page
import { DashboardContext } from '../context/DashboardContext';
import Swal from 'sweetalert2'; // SweetAlert2 for modals
import { TransactionSection } from '../components';
import { Link } from 'react-router-dom';
import { createAuthAxios } from '@/api/authAxios';
import authAxios from '@/api/authAxios';
import ReferralCard from '../components/ReferralCard';
import { TodaySummary } from '.';
import { useState } from 'react';
const DashboardPage = () => {
  const authAxios = createAuthAxios()
  const { user, loading } = useContext(DashboardContext);
  const navigate = useNavigate(); // To navigate the user to the settings page
  const [marqueeMessage, setMarqueeMessage] = useState('Welcome');

  // Show the modal if the user doesn't have a pin
  authAxios
  .post('/dashboard/', { action: 'information' })
  .then((res) => {
    // console.log(res.data);
    if (res.data?.message) {
      setMarqueeMessage(res.data.message); // Update the marquee message
    }
  })
  
  useEffect(() => {
    if (user && user?.pin === null) {
      Swal.fire({
        title: 'Set Your PIN',
        text: 'You currently don’t have a PIN set. Would you like to create one?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Set PIN',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/settings'); // Navigate to settings page to set the PIN
        }
      });
    }
  }, [user, navigate]);

  return (
    <div className="px-1 w-full lg:pr-4">
      {/* Main Dashboard Sections */}
      <div className='w-full justify-center flex'>
      <div className='w-98 bg-green-300 bg-opacity-75 border rounded-2xl mb-3 font-semibold text-slate-950 items-center flex border-vibrantGreen'>
      <marquee behavior="" direction="">{marqueeMessage}</marquee>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:space-x-3 space-x-0 px-3">
        
        {/* Welcome Section - Left Side */}
        <div id='tbd' className="w-full h-auto bg-vibrantGreen bg-opacity-10 border border-vibrantGreen border-opacity-50 rounded-2xl px-7 pt-4 pb-5 flex flex-row justify-between gap-2 relative lg:h-80 md:w-[70%]">
          {/* Left Section */}
          <div className="pt-5">
            <p className="text-neutral-700">Hello! 👋</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-3">
              {loading && !user ? 'Getting data...' : ''} {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-gray-500 tracking-wide mb-3">Explore your dashboard</p>

            {/* Buttons for small screens */}
            <div className="flex justify-between gap-2 lg:hidden">
              <Link to="/fund">
                <button className="inline-flex h-14 animate-shimmer items-center justify-center rounded-2xl border-none bg-[linear-gradient(110deg,#00c158,45%,#7ad67f,55%,#00c158)] bg-[length:200%_100%] px-14 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-40 text-sm whitespace-nowrap hover:opacity-70">
                  Fund Wallet <i className="pi pi-wallet ml-2"></i>
                </button>
              </Link>
              {/* <Link to="/plans">
                <button className="h-14 rounded-2xl border-2 border-vibrantGreen w-14 bg-vibrantGreen">
                  <i className="pi pi-arrow-up font-extrabold text-white"></i>
                </button>
              </Link> */}
            </div>

            {/* Buttons for larger screens */}
            <div className="hidden absolute bottom-5 lg:flex justify-between gap-2">
              <Link to="/fund">
                <button className="inline-flex h-14 animate-shimmer items-center justify-center rounded-2xl border-none bg-[linear-gradient(110deg,#00c158,45%,#7ad67f,55%,#00c158)] bg-[length:200%_100%] px-14 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-52 text-sm whitespace-nowrap hover:opacity-70">
                  Fund Wallet <i className="pi pi-wallet ml-2"></i>
                </button>
              </Link>
              {/* <Link to="/plans">
                <button className="inline-flex h-14 items-center justify-center rounded-2xl border border-vibrantGreen hover:bg-[linear-gradient(110deg,#00c158,45%,#7ad67f,55%,#00c158)] hover:text-white bg-[length:200%_100%] px-14 font-medium text-black transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-52 whitespace-nowrap bg-transparent">
                  Upgrade Account <i className="pi pi-arrow-up ml-2"></i>
                </button>
              </Link> */}
            </div>
          </div>

          {/* Right Section */}
          <div className="pt-10">
            <div className="space-y-1 mb-5">
              <p className="text-gray text-[12px] lg:text-[13px]">Main Balance</p>
              <p className="font-semibold text-black text-opacity-90 text-lg sm:text-3xl">
                <span className="text-opacity-70 text-black whitespace-nowrap">₦</span>
                {loading && !user ? 'Getting data...' : ''} {user?.balance}
              </p>
            </div>
            <div className="flex flex-col text-right absolute bottom-5 right-5 gap-2">
              <div>
                <p className="text-gray text-[11px]">Account Number</p>
                <p className="font-semibold text-black text-opacity-90 text-[12px] lg:text-lg">
                  {loading && !user ? 'Getting data...' : ''} {user?.account_num || null}
                </p>
              </div>
              <div>
                <p className="text-gray text-[11px]">Referral Bonus</p>
                <p className="font-semibold text-black text-opacity-90 text-[12px] lg:text-lg">₦ {user?.referral_bonus}</p>
              </div>
            </div>
          </div>
          
          {/* Styles for screens < 408px */}
          <style>
            {`
              @media (max-width: 408px) {
                #tbd {
                  flex-direction: column  !important;
                  padding: 1rem;
                }
                .h-14 {
                  height: 3rem !important;
                }
                .px-14 {
                  padding-left: 2rem !important;
                  padding-right: 2rem !important;
                }
                .gap-2 {
                  gap: 0.5rem !important;
                }
                .w-40 {
                  width: 10rem !important;
                }
                .text-2xl {
                  font-size: 1.25rem !important;
                }
              }
            `}
          </style>
        </div>
      
        {user?.account_num?(
          <div></div>
        ):(
          <div className='w-full bg-green-200 rounded-md p-2 flex justify-between items-center'>
            <p>Don't have a virtual wallet?</p>
            <div className='flex items-center mr-1'>
            <button className='h-8 w-32 bg-green-500 rounded-md text-white'>Create one <i class='bx bxs-star text-yellow-300 animate-bounce'></i></button>
            </div>
          </div>
        )}
        {/* Features Section */}
        <div className="w-full md:w-[40%] sm:h-80 bg-vibrantGreeni bg-opacity-10 border border-opacity-50 border-vibrantGreen rounded-2xl py-8 sm:mt-0">
          <h2 className="text-gray-800 text-left font-medium  px-4 lg:text-left text-lg sm:text-xl mb-6">Features</h2>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Data */}
            <Link to='/data-sub'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                <i className="pi pi-wifi text-blue-500  text-xl"></i>
              </div>
              <p className="text-gray-800 text-sm">Data</p>
            </div>
            </Link>

            {/* Wallet */}
            <Link to='/fund'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <i className="pi pi-wallet text-green-500 text-xl"></i>
              </div>
              <p className="text-gray-800 text-sm">Wallet</p>
            </div>
            </Link>

            {/* Airtime */}
            <Link to='/airtime-sub'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-2">
                <i className="pi pi-mobile text-yellow-500 text-xl"></i>
              </div>
              <p className="text-gray-800 text-sm">Airtime</p>
            </div>
            </Link>
          
            {/* Electricity */}
            <Link to='/electricity-sub'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                <i className="pi pi-bolt text-purple-500 text-xl"></i>
              </div>
              <p className="text-gray-800 text-sm">Electricity</p>
            </div>
            </Link>

            {/* Education */}
            <Link to='/education'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mb-2">
                <i className="pi pi-book text-pink-500 text-xl"></i>
              </div>
              <p className="text-gray-800 text-sm">Education</p>
            </div>
            </Link>

            {/* Bills */}
            <Link to='/cable-sub'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
                {/* <i className="pi pi-money-bill"></i> */}
                <i class='bx bx-tv  text-red-500 text-2xl'></i>
              </div>
              <p className="text-gray-800 text-sm">Cable</p>
            </div>
            </Link>
            {/* Referral */}
            <Link to='/profile/referrals'>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                <i class="bx bx-user-plus text-amber-500 text-2xl"></i>
              </div>
              <p className="text-gray-800 text-sm">Referral</p>
            </div>
            </Link>
            
          </div>
        </div>
      </div>
              
      <TransactionSection/>
      <div className="p-2 -mt-16">
        <ReferralCard />
      </div>
      {/* <TodaySummary /> */}
    </div>
  );
};

export default DashboardPage;
