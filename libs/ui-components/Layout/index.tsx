import React from 'react';
import { useState } from 'react';

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

  return (
    <>
      <Sidebar
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
        className={`bg-[#F6F9F8] min-h-screen w-full lg:w-[75%] duration-700 ${
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

        <div className="">
          <Outlet />.
        </div>
        <footer className="py-5 px-10 text-center flex gap-3 justify-center  bottom-0 left-0 right-0 relative">
          <a href="https://facebook.com/" className="">
            <img
              src={Assets.Icons.Facebook}
              className="w-[25px] h-[25px]"
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
