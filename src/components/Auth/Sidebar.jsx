import { Link, useLocation } from 'react-router-dom';
import Image from '../../assets/hero.png';
import { useContext } from 'react';
import { DashboardContext } from '@/context/DashboardContext';
import 'boxicons/css/boxicons.min.css';
import { sidebarNavItems } from '@/constants/data.js';  // Import the dynamic sidebar items

const SideBar = ({ sideBarClose, handleSideBarToggle }) => {
  const { user } = useContext(DashboardContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'ring ring-2 ring-vibrantGreen text-white' : 'text-white';
  };

  const toggle = () => {
    if (sideBarClose) {
      handleSideBarToggle();
    }
  };

  return (
    <>
      {/* Overlay to close the sidebar when clicked */}
      {sideBarClose && (
        <div 
          className="fixed inset-0 bg-black opacity-20 z-10 sm:hidden block" 
          onClick={handleSideBarToggle} // Close sidebar on overlay click
        ></div>
      )}
      <Link to='https://wa.me/+2349164661632?text=Hi%20Dataease!!!'>
      <div className='fixed right-4 bottom-4 bg-vibrantGreen flex justify-center items-center rounded-full h-14 w-14'>
      <i class='bx bxl-whatsapp text-white text-4xl'></i>
      </div>
      </Link>
      <nav className={`${sideBarClose ? 'sidebar dark:bg-slate-900' : 'sidebar close dark:bg-slate-900'} z-20`}>
        <div className="menu_content pt-10" onClick={toggle}>
          <ul className="menu_items space-y-6">
            {/* Dynamically generate menu items */}
            {sidebarNavItems.map((item, index) => (
              (item.name === "Admin Panel" && user?.is_superuser) || (item.name !== "Admin Panel") ? (
                <li key={index} className="item">
                  <Link to={item.link} className={`nav_link ${isActive(item.link)}`} title={item.title}>
                    <span className="navlink_icon">
                      <i className={item.icon}></i>
                    </span>
                    <span className="navlink2">{item.name}</span>
                  </Link>
                </li>
              ) : null
            ))}

            {/* User Info Section */}
            <div className="bottom_content">
              <div className="bottom collapse_sidebar text-center dark:bg-slate-900">
                <div className="flex items-center">
                  <img src={Image} alt="User avatar" className="" />
                </div>
                <div className="pr-[1.5px]">
                  <h1 className="text-sm font-bold text-black text-opacity-80 text-left capitalize">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-sm">{user?.email}</p>
                </div>
              </div>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
