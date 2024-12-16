import React from 'react'
import { Button } from "../ui/moving-border";

const Service = () => {
  return (
    <div className='mt-16' id='features'>
        <div>
            <h1 className='text-3xl font-semibold text-center'>Our Services</h1>
        </div>
        <div className='w-full grid grid-cols-1 gap-6 place-items-center  md:grid-cols-3 mt-10 mb-10'>
            <div className='w-96 shadow-spread p-6 rounded-2xl bg-white h-[20rem] border border-slate-200'>
                <div className="flex flex-col ">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <i className="pi pi-wifi text-blue-500  text-2xl"></i>
                </div>
                <p className="text-gray-800 text-2xl font-semibold my-5">Data Subscription</p>
                <p className='mt-2 text-slate-700 tracking-wide text-lg'>Enjoy fast and reliable internet with our flexible data plans, tailored to meet your browsing needs.</p>
                </div>
            </div>
            <div className='w-96 shadow-spread p-6 rounded-2xl bg-white h-[20rem] border border-slate-200'>
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-2">
                <i className="pi pi-mobile text-yellow-500 text-2xl"></i>
              </div> 
                <p className="text-gray-800 text-2xl font-semibold my-5">Airtime Subscription</p>
                <p className='mt-2 text-slate-700 tracking-wide text-lg'>Easily top up your mobile balance with our quick and convenient airtime subscription options.</p>
            </div>

            <div className='w-96 shadow-spread p-6 rounded-2xl bg-white h-[20rem] border border-slate-200'>
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                    <i className="pi pi-bolt text-purple-500 text-2xl"></i>
                </div>
                <p className="text-gray-800 text-2xl font-semibold my-5">Electricity</p>
                <p className='mt-2 text-slate-700 tracking-wide text-lg'>Stay powered up with our seamless electricity subscription services, ensuring you never run out of power.</p>
            </div> 

            <div className='w-96 shadow-spread p-6 rounded-2xl bg-white h-[20rem] border border-slate-200'>
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-2">
                    <i className="pi pi-book text-pink-500 text-2xl"></i>
                </div>
                <p className="text-gray-800 text-2xl font-semibold my-5">Education</p>
                <p className='mt-2 text-slate-700 tracking-wide text-lg'>Access valuable educational resources and tools that support your learning journey and academic success.</p>
            </div> 

            <div className='w-96 shadow-spread p-6 rounded-2xl bg-white h-[20rem] border border-slate-200'>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                    <i className="pi pi-money-bill text-red-500 text-2xl"></i>
                </div>
                <p className="text-gray-800 text-2xl font-semibold my-5">Cable Subscription</p>
                <p className='mt-2 text-slate-700 tracking-wide text-lg'> Elevate your entertainment experience with our affordable cable subscription packages, featuring a wide range of channels.</p>
            </div> 
        </div>
    </div>
  )
}

export default Service