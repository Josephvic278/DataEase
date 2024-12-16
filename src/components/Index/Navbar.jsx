import { useState, useEffect } from 'react'
import MobileNav from './MobileNav'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => {
    setOpenMenu(!openMenu)
  }

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <MobileNav isOpen={openMenu} toggleMenu={toggleMenu} />
      <nav
        className={`bg-transparent top-0 z-[999] backdrop-blur- transition-all border border-transparent duration-500 ${
          isScrolled
            ? 'lg:fixed lg:w-[90%] lg:top-5 lg:py-[3px] lg:shadow-lg lg:rounded-[3rem] lg:border lg:border-[#ddd]'
            : 'lg:sticky lg:w-full lg:top-0 lg:scale-100 lg:py-4'
        }`}
      >
        <div className="w-full flex items-center justify-between py-4 px-[1rem] md:px-[2rem]">
          <div className="text-vibrantGreen text-3xl font-bold">
            <Link to="/" className="">
            <h2 className="text-2xl">Data<span className="bg-gradient-to-r from-gray via-blue-600 to-purple-500 inline-block text-transparent bg-clip-text">Ease</span></h2>
            </Link>
          </div>

          <ul className="items-center justify-center gap-2 space-x-10 hidden lg:flex">
            <li className="navlink">
              <a href="#home">Home</a>
            </li>
            <li className="navlink">
              <a href="#about">About Us</a>
            </li>
            <li className="navlink">
              <a href="#features">Features</a>
            </li>
            {/* <li className="navlink">
              <a href="#community">Community</a>
            </li> */}
            <li className="navlink">
              <a href="#faq">FAQs</a>
            </li>
          </ul>

          <div className="flex gap-2 lg:hidden">
            <Link to="/login" className="w-[8rem] h-[2.8rem] text-[14px] flex items-center justify-center border border-gray text-[#333] rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.04]">Sign In</Link>
            <button className="menu-btn" onClick={toggleMenu}>
              <span className={`pi ${openMenu ? 'pi-times' : 'pi-bars'} text-[1rem]`}></span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/login" className="w-[8rem] h-[2.8rem] text-[14px] flex items-center justify-center border border-gray text-[#333] rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.04]">
              Login
            </Link>
            <Link to="/register" className="menu-btn2 bg-vibrantGreen block">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="px-4 w-full flex items-center justify-center">
        <div className="bg-gray bg-opacity-40 w-[78%] h-[0.2px] px-2" />
      </div>
    </>
  )
}

export default Navbar
