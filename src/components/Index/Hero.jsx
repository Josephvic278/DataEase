import { useEffect, useRef } from 'react';
import { BackgroundBeams } from "../ui/background-beams";
import { Element, Link as LinkScroll } from "react-scroll";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import Img from '../../assets/hero2.png'
import { Link } from 'react-router-dom';

const Hero = () => {
	const ballRefs = useRef([]);

	// Function to capture mouse movement and animate the balls
	const handleMouseMove = (e) => {
	    const { innerWidth, innerHeight } = window;
	    const xPos = (e.clientX / innerWidth) - 0.5;
	    const yPos = (e.clientY / innerHeight) - 0.5;

	    // Animate each ball slightly based on mouse movement
	    ballRefs.current.forEach((ball, index) => {
	      const movementIntensity = (index + 1) * 10; // Customize how much each ball moves
	      gsap.to(ball, {
	        x: xPos * movementIntensity,
	        y: yPos * movementIntensity,
	        duration: 1.2,
	        ease: "power2.out",
	      });
	    });
  	};


	  useEffect(() => {
	    // Add mousemove listener to the window
	    window.addEventListener('mousemove', handleMouseMove);

	    // Clean up mousemove listener on component unmount
	    return () => {
	      window.removeEventListener('mousemove', handleMouseMove);
	    };
	  }, []);

	return (
		<section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32 nmb-[200rem] z-1 mt-8 sm:mt-0" id='home'>
		{/* Background 3D balls */} 
        <div className="scale-[0.7]   lg:scale-[0.9] absolute inset-0 -z-10 mt-8 sm:mt-0">
          <div  
            ref={(el) => (ballRefs.current[0] = el)} 
            className="scale-[0.7] absolute top-8 left-12 w-[2.2rem] h-[2.2rem] bg-gradient-to-r from-beige to-gray rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.3),_inset_0_0_10px_rgba(255,255,255,0.2)]">
          </div>
          <div 
            ref={(el) => (ballRefs.current[1] = el)} 
            className="scale-[0.9] absolute top-28 right-16 w-[3rem] h-[3rem] bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4),_inset_0_0_12px_rgba(255,255,255,0.2)]">
          </div>
          <div 
            ref={(el) => (ballRefs.current[2] = el)} 
            className="scale-[0.9] absolute top-[13%] left-1/3 w-[4.5rem] 	h-[4.5rem] bg-gradient-to-r from-black to-teal-500 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3),_inset_0_0_10px_rgba(255,255,255,0.2)]">
          </div>
          
     
        </div>
	      <Element name="hero">
	        <div className="container -mt-28 sm:mt-0">
	          <div className="relative z-2 max-w-512 max-lg:max-w-388">
	            <div className="caption small-2 uppercase text-orangeYellow">
	                   Simplifying VTU for Everyone

	            </div>
	            <h1 className="mb-6 h1 text-vibrantGreen uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
	                  VTU Made Easy

	            </h1>
	            <p className="max-w-440 mb-14 body-2 max-md:mb-10 text-zinc-700 mt-32 sm:mt-0">
				        DataEase provides quick and reliable VTU services, including airtime, data, and bill payments, for individuals and businesses.


	            </p>
	            <LinkScroll to="features" offset={-100} spy smooth>
				{/* <button className="main-btn block sm:hidden">
  						Get Started
				</button> */}
				<div className=' justify-around w-19/20 flex '>
				<Link to='/register'>
				<button className="main-btn">
  						Register
				</button>
				</Link>
				<Link to='/login' className='w-full'>
				<button className="w-4/5 h-16 bg-white border-2 border-vibrantGreen ml-4 rounded-xl font-bold text-vibrantGreen">
  						Login
				</button>
				</Link>
				</div>
	            </LinkScroll>
	          </div>

	          <div className="absolute -top-32 left-[calc(50%-340px)] w-[1230px] pointer-events-none hero-img_res lg:block hidden">
	            <img
	              src={Img}
	              className="size-1230 scale-[0.892] lg:scale-[0.534]  max-lg:h-auto object-cover"
	              alt="hero"
	            />
	          </div>
	        </div>
	      </Element>
	      <BackgroundBeams />
	    </section>
	)
}

export default Hero