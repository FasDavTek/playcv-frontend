import { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { logo } from '../utils/constants';
import { SearchBar } from '.';
import { useCart } from '../context/CartProvider';
import * as Assets from '@video-cv/assets';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Button } from '@video-cv/ui-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthProvider';

const Hamburger = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 52 24">
    <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
      <rect id="Rectangle_3" data-name="Rectangle 3" width="42" height="4" rx="2" transform="translate(304 47)" fill="#574c4c" />
      <rect id="Rectangle_5" data-name="Rectangle 5" width="42" height="4" rx="2" transform="translate(304 67)" fill="#574c4c" />
      <rect id="Rectangle_4" data-name="Rectangle 4" width="52" height="4" rx="2" transform="translate(294 57)" fill="#574c4c" />
    </g>
  </svg>
);

const Navbar = () => {
  const { cartState } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleNavItemClick = () => {
    setShowNavbar(false);
  };

  const handleCartClick = () => {
    handleNavItemClick();
    navigate('/cart');
  };

  const handleGetStartedClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div
      className={`flex items-center px-3 md:px-10 sticky bg-white top-0 justify-center z-20 navbar`}
    >
      <div className="w-full mx-auto flex items-center justify-between">
        <Link
          className=""
          to="/"
          style={{ display: 'flex', borderRadius: 'lg', alignItems: 'center' }}
        >
          <img src={Assets.Images.LogoWhite} alt="logo" className="h-14 rounded-lg" />
          {/* <h2 className="text-black text-2xl">Logo</h2> */}
        </Link>
        {/* <SearchBar /> */}
        <div className="menu-icon" onClick={handleShowNavbar}>
          {showNavbar ? <MenuOpenIcon sx={{ width: '1.75rem', height: '1.75rem' }} className='w-12 h-12' /> : <MenuIcon sx={{ width: '1.75rem', height: '1.75rem' }} className='w-12 h-12' />}
        </div>
        <div className={`nav-elements ${showNavbar && 'active'} justify-start px-3`}>
          <ul>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive, isPending }) =>
                  `text-black text-lg  ${
                    isPending
                      ? 'pending'
                      : isActive
                      ? 'active-nav-link'
                      : 'nav-link'
                  }`
                }
                onClick={handleNavItemClick}
              >
                Find VideoCV
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/talents"
                className={({ isActive, isPending }) =>
                  `text-black text-lg  ${
                    isPending
                      ? 'pending'
                      : isActive
                      ? 'active-nav-link'
                      : 'nav-link'
                  }`
                }
                onClick={handleNavItemClick}
              >
                Talent Gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/job-board"
                className={({ isActive, isPending }) =>
                  `text-black text-lg  ${
                    isPending
                      ? 'pending'
                      : isActive
                      ? 'active-nav-link'
                      : 'nav-link'
                  }`
                }
                onClick={handleNavItemClick}
              >
                Job Board
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/candidate/dashboard"
                className={({ isActive, isPending }) =>
                  `text-black text-lg  ${
                    isPending
                      ? 'pending'
                      : isActive
                      ? 'active-nav-link'
                      : 'nav-link'
                  }`
                }
                onClick={handleNavItemClick}
              >
                Professional
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employer/dashboard"
                className={({ isActive, isPending }) =>
                  `text-black text-lg  ${
                    isPending
                      ? 'pending'
                      : isActive
                      ? 'active-nav-link'
                      : 'nav-link'
                  }`
                }
                onClick={handleNavItemClick}
              >
                Employer
              </NavLink>
            </li>
            {isAuthenticated && user.role === 'employer' && (
              <li>
                {/* TODO: Show logged in if user is logged in */}
                <button
                  onClick={handleCartClick}
                  className="rounded-full h-fit w-fit px-1 py-1 flex gap-2 items-center relative"
                >
                  <img
                    alt=""
                    src={Assets.Icons.Cart}
                    className="w-[25px] h-[25px]"
                  />
                  <div className='py-0 px-1.5 bg-neutral-200 text-white text-sm absolute -top-1.5 left-4 rounded-full'>
                    {cartState.cart.length}
                  </div>
                </button>
              </li>
            )}
            <Button variant='black' label='Get Started' onClick={handleGetStartedClick} />
            <Dialog fullScreen={fullScreen} aria-labelledby="responsive-dialog-title" open={openModal} onClose={handleCloseModal}>
              <DialogTitle id="responsive-dialog-title">Get Started</DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '.95rem' }}>
                <DialogContentText display='flex' flexDirection='column' gap='.8rem'>
                  <p>
                    Welcome to VideoCV! Choose your path to join our community and unlock your potential.
                  </p>
                  <p>
                    <strong>For Professionals:</strong> Create a compelling video resume and showcase your skills to top employers.
                  </p>
                  <p>
                    <strong>For Employers:</strong> Discover talented professionals and streamline your hiring process with our innovative platform.
                  </p>
                </DialogContentText>
                <Stack mx='auto' direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="black" className='text-sm' label='Sign up as Professional' onClick={() => navigate('/candidate/profile/:id')}>
                  </Button>
                  <Button variant="black" className='text-sm' label='Sign up as Employer' onClick={() => navigate('/employer/profile/:id')}>
                  </Button>
                </Stack>
              </DialogContent>
            </Dialog>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
