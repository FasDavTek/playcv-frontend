import { useState, useEffect, useRef, } from 'react';

import { Link, Outlet } from 'react-router-dom';
import { Modal } from '@mui/material';

import './Layout.scss';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { INavItem } from './types';
import LogoutModal from './LogoutModal';
import { CandidateRoutes, EmployerRoutes, AdminRoutes } from '../../constants';
import * as Assets from '../../assets';

const userTypeIdMap: { [key: string]: 1 | 2 | 3 } = {
  Professional: 3,
  Employer: 2,
  Admin: 1,
}


const Layout = ({
  type = 'Professional',
}: {
  type?: 'Professional' | 'Employer' | 'Admin';
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = {
    Professional: CandidateRoutes,
    Employer: EmployerRoutes,
    Admin: AdminRoutes,
  };

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const closeLogoutModal = () => setLogoutModalOpen(false);

  const toggleSidebarExpanded = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

 
  const handleLogout = () => {
    openLogoutModal();
  };


  const confirmLogout = () => {
    closeLogoutModal();
  };


  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <>
      <Sidebar
        ref={sidebarRef}
        onLogout={handleLogout}
        toggleSidebarExpanded={toggleSidebarExpanded}
        sidebarExpanded={sidebarExpanded}
        navlinks={routes[type]}
        sidebarOpen={sidebarOpen}
        // userDetails={userDetails}
        userDetails={{}}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main
        className={`bg-[#F6F9F8] min-h-dvh w-full lg:w-[75%] duration-700 ${
          sidebarExpanded
            ? 'lg:ml-auto min-w-[calc(100%-300px)]'
            : 'lg:ml-auto min-w-[calc(100%-70px)]'
        }`}
      >
        <Navbar
          onLogout={handleLogout}
          userDetails={{}}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          userTypeId={userTypeIdMap[type]}
          // navbarConfig={navbarConfig}
        />

        <div className="min-h-screen flex-1 overflow-auto">
          <Outlet />.
        </div>
        <footer className="bg-[#F6F9F8] py-4 md:py-8 px-4 md:px-10 text-sm md:text-base mt-auto z-10 bottom-0 left-0 right-0">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-stretch md:justify-between gap-6 md:gap-10 w-full">
              {/* Contact Section */}
              <div className="flex flex-col items-start text-sm md:text-base">
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <a 
                  href="https://wa.me/2347065245969" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                >
                  <img
                    src={Assets.Icons.WhatsAppLink}
                    alt="WhatsApp"
                    className="w-5 h-5 mr-2"
                  />
                  WhatsApp Chat Support
                </a>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col items-start">
                <h3 className="font-semibold mb-2">Quick Links</h3>
                <Link to="/terms-and-conditions" className="hover:underline mb-1 text-sm md:text-base">Terms and Conditions</Link>
                <Link to="/advert-policy" className="hover:underline mb-1 text-sm md:text-base">Advert Policy</Link>
                <Link to="/privacy-policy" className="hover:underline text-sm md:text-base">Privacy Policy</Link>
              </div>

              {/* Social Media and Copyright */}
              <div className="flex flex-col items-start md:items-end">
                <a href="https://facebook.com/" className="mb-2" aria-label="Facebook">
                  <img
                    src={Assets.Icons.FacebookLink}
                    className="w-8 h-8 md:w-6 md:h-6 icon-blue"
                    alt="Facebook icon"
                  />
                </a>
                <p className="text-left md:text-right text-sm md:text-base">
                  Powered by National Youth Service Corps | BLOGME | DRAGNET. <br />
                  All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <Modal open={logoutModalOpen} onClose={closeLogoutModal}>
        <div>
          {<LogoutModal onLogout={confirmLogout} onClose={closeLogoutModal} />}
        </div>
      </Modal>
    </>
  );
};

export default Layout;
