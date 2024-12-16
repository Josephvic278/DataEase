import React from 'react'
import { Link } from 'react-router-dom'

const FooterBase = () => {
	return (
		<div className="bg-green-100 mt-16 text-black py-8" id='about'>
		  <div className="container mx-auto px-4 text-center">
			{/* Footer Text */}
			<div className="text-vibrantGreen text-3xl font-bold">
            <Link to="/" className="">
            <h2 className="text-2xl">Data<span className="text-yellow-400">Ease</span></h2>
            </Link>
          </div>
		  <p className="text-sm mt-8">
			  © 2024 DataEase. All Rights Reserved.
		  </p>
	
			{/* Social Media Links */}
			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 my-8">
			  <a href="https://www.facebook.com/profile.php?id=61569126261277" className="hover:text-gray-400 flex items-center justify-center space-x-2">
				<i className="bx bxl-facebook"></i>
				<span>Facebook</span>
			  </a>
			  <a href="#" className="hover:text-gray-400 flex items-center justify-center space-x-2">
				<i className="bx bxl-twitter"></i>
				<span>Twitter</span>
			  </a>
			  <a href="#" className="hover:text-gray-400 flex items-center justify-center space-x-2">
				<i class='bx bxl-instagram-alt'></i>
				<span>Instagram</span>
			  </a>
			  <a href="#" className="hover:text-gray-400 flex items-center justify-center space-x-2">
				<i className="bx bxl-linkedin"></i>
				<span>LinkedIn</span>
			  </a>
			</div>
	
			{/* Additional Info */}
			<div className="mt-4 w-full">
			  <a href="mailto:dataease247@gmail.com" className="text-md font-medium text-gray-600">Email: dataease247@gmail.com</a><br />
			  <a href="#" className="text-md font-medium text-gray-600">Address: No 78 Igbariam Street Achara Layout Enugu</a><br />
			  <a href="#" className="text-md font-medium text-gray-600">Phone No: 09164661632</a>
			</div>
		  </div>
		</div>
	  );
}

export default FooterBase