import { useState, useEffect, useRef, } from 'react';

import { Outlet } from 'react-router-dom';
import { Modal } from '@mui/material';

import './Layout.scss';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { INavItem } from './types';
import LogoutModal from './LogoutModal';
import { CandidateRoutes, EmployerRoutes, AdminRoutes } from '../../constants';
import * as Assets from '../../assets';

const Layout = ({
  type = 'Candidate',
}: {
  type?: 'Candidate' | 'Employer' | 'Admin';
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [logoutModalOpen, setLogoutMOdalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = {
    Candidate: CandidateRoutes,
    Employer: EmployerRoutes,
    Admin: AdminRoutes,
  };

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const openLogoutModal = () => {
    setLogoutMOdalOpen(true);
  };

  const closeLogoutModal = () => setLogoutMOdalOpen(false);

  const toggleSidebarExpanded = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleLogout = () => {
    setLogoutMOdalOpen(true);
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
          // navbarConfig={navbarConfig}
        />

        <div className="min-h-screen flex-1 overflow-auto">
          <Outlet />.
        </div>
        <footer className="bg-[#F6F9F8] py-1 md:py-5 px-3 md:px-10 text-center flex gap-3 justify-center bottom-0 left-0 right-0 sticky">
          <a href="https://facebook.com/" className="">
            <img
              src={Assets.Icons.FacebookLink}
              className="w-[2.125rem] h-[2.125rem] md:w-[25px] md:h-[25px] icon-blue"
              alt="facebook icon"
            />
          </a>
          <p className="">
            Powered by National Youth Service Corps | BLOGME | DRAGNET. All
            rights reserved.
          </p>
        </footer>
      </main>

      <Modal open={logoutModalOpen} onClose={closeLogoutModal}>
        <div>
          {<LogoutModal onLogout={() => {}} onClose={closeLogoutModal} />}
        </div>
      </Modal>
    </>
  );
};

export default Layout;
