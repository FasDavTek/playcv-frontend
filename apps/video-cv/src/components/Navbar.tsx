import { useState, useEffect, useRef } from 'react';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Badge, { BadgeProps } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useCart } from '../context/CartProvider';
import * as Assets from '@video-cv/assets';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Button, useToast } from '@video-cv/ui-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from './../../../../libs/context/AuthContext';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../libs/utils/sessionStorage';

const Hamburger = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 52 24">
    <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
      <rect id="Rectangle_3" data-name="Rectangle 3" width="42" height="4" rx="2" transform="translate(304 47)" fill="#574c4c" />
      <rect id="Rectangle_5" data-name="Rectangle 5" width="42" height="4" rx="2" transform="translate(304 67)" fill="#574c4c" />
      <rect id="Rectangle_4" data-name="Rectangle 4" width="52" height="4" rx="2" transform="translate(294 57)" fill="#574c4c" />
    </g>
  </svg>
);

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

const Navbar = () => {
  const { cartState } = useCart();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();

  const navbarRef = useRef<HTMLDivElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setShowNavbar(false);
    }
  };

  useEffect(() => {
    if (showNavbar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNavbar]);

  // const isAuthenticated = () => {
  //   const user = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER);
  //   const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  //   return user && token;
  // }

  const handleAuthenticatedNavigation = (path: string) => {
    if (!authState.isAuthenticated) {
      showToast(`This area is for registered users. Please authenticate to continue.`, 'warning')
      navigate('/')
      return
    }

    const userTypeId = authState.user?.userTypeId;

    switch (path) {
      case '/admin/dashboard':
        if (userTypeId === 1) {
          navigate(path)
        } else {
          showToast("Secure area detected. Authentication required to enter.", 'error')
        }
        break
      case '/employer/dashboard':
        if (userTypeId === 2) {
          navigate(path)
        } else {
          showToast("Authentication required. Let's get you logged in.", 'error')
        }
        break
      case '/candidate/dashboard':
        if (userTypeId === 3) {
          navigate(path)
        } else {
          showToast("Authentication required. Let's get you logged in.", 'error')
        }
        break
      default:
        return;
    }
  };

  return (
    <div
      ref={navbarRef}
      className={`flex items-center px-3 md:px-7 sticky bg-white top-0 justify-center navbar ${
        isScrolled ? 'scrolled' : ''
      } bg-white`}
    >
      <div className="w-full mx-auto flex items-center justify-between lg:h-auto">
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
          {showNavbar ? <MenuOpenIcon sx={{ width: {xs: '1.75rem', lg:'2rem'}, height: {xs: '1.75rem', lg:'2rem'} }} className='w-12 h-12 z-50' /> : <MenuIcon sx={{ width: {xs: '1.75rem', lg:'2rem'}, height: {xs: '1.75rem', lg:'2rem'} }} className='w-12 h-12 z-50' />}
        </div>
        <div className={`nav-elements ${showNavbar && 'active'} justify-start md:px-3`}>
          <div className="mt-4 flex lg:hidden" onClick={handleShowNavbar}>
            {showNavbar && <MenuOpenIcon sx={{ width: {xs: '1.75rem', lg:'2rem'}, height: {xs: '1.75rem', lg:'2rem'} }} className='w-12 h-12 lg:w-24 lg:h-24 z-50 ml-auto mr-3 lg:mr-4' />}
          </div>
          <ul className='items-start'>
            <li>
              <NavLink
                to="/"
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
                Home
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
            <li className='my-3 md:my-0'>
              <NavLink
                to="/video-guideline"
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
                Cv Guidelines
              </NavLink>
            </li>
            <li className='my-3 md:my-0'>
              <NavLink
                to="/faq"
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
                FAQ
              </NavLink>
            </li>
            {token && authState.isAuthenticated && authState?.user?.userTypeId === 3 && (
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
                  onClick={(e) => {
                    e.preventDefault()
                    handleAuthenticatedNavigation('/candidate/dashboard')
                  }}
                >
                  My Dashboard
                </NavLink>
              </li>
            )}
            {token && authState.isAuthenticated && authState?.user?.userTypeId === 2 && (
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
                  onClick={(e) => {
                    e.preventDefault()  
                    handleAuthenticatedNavigation('/employer/dashboard')
                  }}
                >
                  My Dashboard
                </NavLink>
              </li>
            )}
            {token && authState.isAuthenticated && authState?.user?.userTypeId === 1 && (
              <li>
                <NavLink
                  to='/admin/dashbaord'
                  className={({ isActive, isPending }) =>
                    `text-black text-lg  ${
                      isPending
                        ? 'pending'
                        : isActive
                        ? 'active-nav-link'
                        : 'nav-link'
                    }`
                  }
                  onClick={(e) => {
                    e.preventDefault()  
                    handleAuthenticatedNavigation('/admin/dashboard')
                  }}
                >
                  My Dashboard
                </NavLink>
              </li>
            )}
            {token && authState.isAuthenticated && authState.user?.userTypeId === 2 && (
              <li className='mt-5 md:mt-0'>
                {/* TODO: Show logged in if user is logged in */}
                <IconButton aria-label="cart" onClick={handleCartClick} className='w-5 h-5 lg:w-10 lg:h-10'>
                  <StyledBadge badgeContent={cartState.cart.length} >
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              </li>
            )}
            <div className="flex flex-col lg:flex-row justify-start gap-4 mt-4 lg:mt-0 md:ml-4 lg:ml-0">
              {token && authState.isAuthenticated ? (
                <Button variant='black' className='w-full md:w-auto' label='Logout' onClick={logout} />
              ) : (
                <div className='flex flex-col lg:flex-row justify-start gap-3.5'>
                  <Button variant='black' className='w-full md:w-auto' label='Get Started' onClick={handleGetStartedClick} />
                  <Button variant='black' className='w-full md:w-auto' label='Log in' onClick={() => navigate('/auth/login')} />
                </div>
              )}
            </div>
            <Dialog fullScreen={fullScreen} aria-labelledby="responsive-dialog-title" open={openModal} onClose={handleCloseModal}>
              <DialogTitle id="responsive-dialog-title">
                <strong className=' text-neutral-200'>Get Started</strong>
              </DialogTitle>
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
                Welcome to VideoCV! Choose your path to join our community and unlock your potential.
                <strong>For Professionals:</strong> Create a compelling video resume and showcase your skills to top employers.
                <br />
                <strong>For Employers:</strong> Discover talented professionals and streamline your hiring process with our innovative platform.
              </DialogContentText>
                <Stack mx='auto' direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="black" className='text-sm' label='Sign up as Professional' onClick={() => navigate('/auth/professional-signup')} >
                  </Button>
                  <Button variant="black" className='text-sm' label='Sign up as Employer' onClick={() => navigate('/auth/employer-signup')} >
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
