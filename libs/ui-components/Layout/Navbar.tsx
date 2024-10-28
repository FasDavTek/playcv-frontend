import React from 'react';
import { useState, MouseEvent, useEffect } from 'react';

import { Avatar, Box, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import { toggleSidebar } from '@video-cv/shared_store';
import * as Assets from '../../assets';
// import { IUser } from 'Models/auth.models';
import {
  AdminRoutes,
  CandidateRoutes,
  EmployerRoutes,
} from '../../constants';
import { AccountMenu } from '../Account/AccountMenu';

interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: string;
}

const Navbar = ({
  userDetails,
  onLogout,
  toggleSidebar = () => {},
}: // navbarConfig,
{
  userDetails: any | null;
  onLogout: () => void;
  toggleSidebar?: () => void;
  // navbarConfig: { name: string; path: string }[];
}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentPageName, setCurrentPageName] = useState('');

  const getPageName = (pathname: string) => {
    if (pathname === '/') {
      return 'Dashboard';
    }
    const route = [...CandidateRoutes, ...EmployerRoutes, ...AdminRoutes].find(
      (item) => pathname === item.route || pathname.includes(item?.route)
    );
    return route ? route.pageName : 'Unknown Page';
  };

  useEffect(() => {
    setCurrentPageName(getPageName(location.pathname) || '');
  }, [location.pathname]);

  const currentAccount: Account = {
    id: userDetails?.id || '1',
    name: userDetails?.USER_FULLNAME || 'John Doe',
    email: userDetails?.email || 'john@example.com',
    avatar: userDetails?.avatar || '/static/images/avatar/1.jpg',
    userType: userDetails?.userType || 'User',
  };

  const accounts: Account[] = [ currentAccount, ];

  const handleSwitchAccount = (account: Account) => {
    // Implement account switching logic here
    console.log('Switching to account:', account);
  };

  const handleSignOut = () => {
    onLogout();
  };

  return (
    <nav className="shadow sticky z-50 bg-[#F6F9F8] top-0 px-5 pt-4 md:px-6 md:pt-6 pb-2 flex justify-between">
      <div className="flex">
        <button
          onClick={() => {
            toggleSidebar();
          }}
          className="btn-icon lg:hidden"
        >
          <img src={Assets.Icons.Hamburger} alt="" />
        </button>

        <div className="hidden md:flex items-center">
          <h3 className="text-xl ml-3">{currentPageName}</h3>
        </div>
      </div>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box >
          <AccountMenu
            currentAccount={currentAccount}
            accounts={accounts}
            onSwitchAccount={handleSwitchAccount}
            onSignOut={handleSignOut}
          />
        </Box>
      </Box>
    </nav>
  );
};

export default Navbar;
