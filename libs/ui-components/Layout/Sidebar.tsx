import React, { forwardRef, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Divider, Modal } from '@mui/material';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import * as Assets from '../../assets';
import { INavItem } from './types';
import LogoutModal from './LogoutModal';
import { useAuth } from './../../../libs/context/AuthContext';

interface SidebarProps {
  userDetails: any | null;
  navlinks: INavItem[];
  sidebarExpanded: boolean;
  toggleSidebarExpanded: () => void;
  onLogout: () => void;
  sidebarOpen?: boolean;
  closeSidebar?: () => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      userDetails,
      navlinks,
      sidebarExpanded,
      toggleSidebarExpanded,
      onLogout,
      sidebarOpen = false,
      closeSidebar = () => {},
    },
    ref
  ) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleCloseSidebar = () => {
      closeSidebar();
    };

    const handleSignOut = () => {
      onLogout();
    };

    const confirmLogout = () => {
      logout();
      setIsLogoutModalOpen(false);
      navigate('/auth/login');
    };

    return (
      <aside
        ref={ref}
        className={`px-4 py-10 md:px-6 md:py-14 md:pr-10 bg-[#1e6091] h-screen fixed top-0 [z-index:51] duration-500 w-[80%] max-w-[300px] text-sm text-white overflow-y-auto lg:!left-0 ${
          sidebarOpen ? ' left-0 ' : ' left-[-100%] '
        } 
        ${
          sidebarExpanded
            ? ' lg:w-[25%] lg:max-w-[300px] '
            : ' lg:px-2 lg:w-[70px] lg:max-w-[unset] collapsed-sidebar '
        }`}
      >
        <button
          className="btn-icon lg:hidden block ml-auto mb-4 mr-2 p-0.5 rounded-full bg-[#f8f9fa] cursor-pointer"
          onClick={handleCloseSidebar}
        >
          <img src={Assets.Icons.X} className="w-5" alt="" />
        </button>

        <Link to="/" className="logoAndName flex cursor-pointer mb-9">
          <img src={Assets.Images.LogoWhite} alt="Facility Logo" className="h-14 rounded-md" />
        </Link>

        <Divider className='text-white' />

        <p className="mt-10 mb-5 px-4">
          <span className="collapse-hideText cursor-default text-xl font-bold">
            MAIN
          </span>
        </p>

        <div className="mt-2">
          {navlinks?.map((navItem, index) => {
            if (navItem?.children) {
              return (
                <Accordion key={index}>
                  <AccordionSummary
                    aria-controls={navItem.name}
                    id={navItem.name}
                  >
                    <div className="px-4 py-3 flex items-center space-x-3 text-black">
                    {navItem.img && <img className="w-5 icon" src={navItem.img} alt={navItem.name} />}
                      <span className="collapse-hideText">{navItem.name}</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="subnavs">
                      {navItem.children.map((item) => (
                        <NavLink
                          key={item.route}
                          onClick={handleCloseSidebar}
                          to={item.route}
                          className={({ isActive }) =>
                            `main-icon ${isActive ? 'main-icon active' : 'main-icon'}`
                          }
                        >
                          {item.img && <img className="w-5 icon" src={item.img} alt={item.name} />}
                          <span className="collapse-hideText">{item.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            } else {
              return (
                <NavLink
                  key={index}
                  onClick={handleCloseSidebar}
                  to={navItem.route}
                  className={({ isActive }) =>
                    `!mt-2 main-icon text-white font-semibold ${isActive ? 'active' : ''}`
                  }
                >
                  {navItem.img && <img className="w-5 icon" src={navItem.img} alt={navItem.name} />}
                  <span className="collapse-hideText">{navItem.name}</span>
                </NavLink>
              );
            }
          })}

          <Divider className='text-white' />

          <div className="messaging-holder mb-14 mt-10">
            <a
              href="https://wa.me/2347065245969"
              target="_blank"
              className="collapse-hideText text-white font-semibold underline messaging-navlink"
            >
              Support
            </a>
          </div>
          <div
            className={`bottom-0 ml-4 relative text-white font-semibold ${
              !sidebarExpanded && 'hidden'
            }`}
          >
            Go to{' '}
            <a
              className="underline text-white"
              href="https://nyscjobs.ng/home/"
              target="_blank"
            >
              nyscjobs.ng
            </a>
          </div>

          <button
            onClick={confirmLogout}
            className="main-icon w-full flex justify-between mt-16"
          >
            <span className="collapse-hideText">Logout</span>
            <LogoutIcon />
          </button>
        </div>

        <Modal open={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
          <>
            <LogoutModal onClose={() => setIsLogoutModalOpen(false)} onLogout={confirmLogout} />
          </>
        </Modal>
      </aside>
    );
  }
);

export default Sidebar;
