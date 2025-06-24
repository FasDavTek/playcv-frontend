import React from 'react';
import { useState, MouseEvent, useEffect } from 'react';

import { Avatar, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
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
import { useAuth } from './../../../libs/context/AuthContext';
import { SESSION_STORAGE_KEYS } from './../../../libs/utils/sessionStorage';
import { styled, useTheme } from '@mui/material/styles';
import Badge, { BadgeProps } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../../apps/video-cv/src/context/CartProvider';

interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: string;
}

interface NavbarProps {
  userDetails: any
  onLogout: () => void
  toggleSidebar?: () => void
  userTypeId: 1 | 2 | 3
}

const Navbar = ({
  userDetails,
  onLogout,
  toggleSidebar = () => {},
  userTypeId,
}: NavbarProps) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { cartState } = useCart();
  const { authState } = useAuth();
  const theme = useTheme();

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 3,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      backgroundColor: '#616161',
      color: '#fff',
    },
  }));

  const [currentPageName, setCurrentPageName] = useState('');

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const getPageName = (pathname: string) => {
    if (pathname === '/') {
      return 'Dashboard';
    }

    let routes
    switch (userTypeId) {
      case 1:
        routes = AdminRoutes
        break
      case 2:
        routes = EmployerRoutes
        break
      case 3:
        routes = CandidateRoutes
      default:
        return;
    }

    const route = routes.find((item: { route: string; }) => pathname === item.route || pathname.includes(item?.route)
    );
    return route ? route.pageName : 'Unknown Page';
  };

  useEffect(() => {
    setCurrentPageName(getPageName(location.pathname) || '');
  }, [location.pathname, userTypeId, getPageName]);

  const currentAccount: Account = {
    id: userDetails?.id,
    name: userDetails?.USER_FULLNAME,
    email: userDetails?.email,
    avatar: userDetails?.avatar,
    userType: userDetails?.userType,
  };

  const accounts: Account[] = [ currentAccount, ];

  const handleSwitchAccount = (account: Account) => {
    // Implement account switching logic here
    console.log('Switching to account:', account);
  };

  const handleSignOut = () => {
    onLogout();
  };

  const handleCartClick = () => {
    navigate('/cart');
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
        {token && authState.isAuthenticated && authState.user?.userTypeId === 2 && (
          <>
            {/* TODO: Show logged in if user is logged in */}
            <IconButton aria-label="cart" onClick={handleCartClick} className='w-5 h-5 lg:w-10 lg:h-10'>
              <StyledBadge badgeContent={cartState.cart.length} >
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </>
        )}

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
