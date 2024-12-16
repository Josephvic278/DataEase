import { useState } from 'react'

const MobileNav = ({ isOpen, toggleMenu }) => {
	return (
		<>
			<div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
				<div className="w-[60vw] h-screen bg-white p-[2rem]">
					<div className="text-vibrantGreen text-3xl font-bold">
			            <h1 className="mb-16">
			              Data<span className="text-gray">Ease</span>
			            </h1>
          			</div>
					<ul className="flex flex-col gap-4 ml-2 space-y-4 text-gray">
						<li className="navlink"><a href="#home">Home</a></li>
						<li className="navlink"><a href="#about">About Us</a></li>
						<li className="navlink"><a href="#features">Services</a></li>
						{/* <li className="navlink"><a href="#community">Community</a></li> */}
						<li className="navlink"><a href="#faq">Service Quality</a></li>
					</ul>
				</div>
			</div>
		</>
	)
}

export default MobileNav