import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AuthLayout = () => {
	const [sideBarClose, setSideBarClose] = useState(false)
  
	const handleSideBarToggle = () => {
	  setSideBarClose(!sideBarClose)
	}
  return (
    <>
      <div>
        <Navbar handleSideBarToggle={handleSideBarToggle} closed={sideBarClose} />
        <Sidebar sideBarClose={sideBarClose} handleSideBarToggle={handleSideBarToggle} />
        <div className="max-w-7xl h-screen mt-24 sm:ml-[90px]">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AuthLayout