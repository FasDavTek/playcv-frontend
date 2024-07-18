import React from 'react';
import { useState, MouseEvent, useEffect } from 'react';

import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import { toggleSidebar } from '@video-cv/shared_store';
import * as Assets from '@video-cv/assets';
// import { IUser } from 'Models/auth.models';
import {
  AdminRoutes,
  CandidateRoutes,
  EmployerRoutes,
} from '@video-cv/constants';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const location = useLocation();

  const viewProfile = () => {
    handleClose();
    navigate('/settings/general');
  };

  const logout = () => {
    onLogout();
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

          {/* <div className=""></div> */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center rounded-full bg-white justify-center w-12 h-12">
          {/* <img src={Assets.Icons.NotificationBell} alt="" /> */}
        </div>

        <div className="rounded-xl bg-white md:w-[300px] pl-8 pr-4 gap-3 py-2.5 flex items-center">
          <img
            className="w-12 h-12 rounded-full"
            // src={Assets.Images.Temp.DummyUserIcon2}
            alt=""
          />

          <div className="flex-1">
            <p className="font-bold text-blackText">
              {userDetails?.USER_FULLNAME}
            </p>

            <p className="text-greyText text-sm">{userDetails?.userType}</p>
          </div>

          <button onClick={handleClick} className="btn-icon">
            {/* <img src={Assets.Icons.SolidArrowDown} alt="" /> */}
          </button>
        </div>
      </div>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => viewProfile()}>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            {/* {<img src={Assets.Icons.Logout} alt="" />} */}
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default Navbar;
