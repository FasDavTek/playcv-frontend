import { useState } from 'react';

import { Stack } from '@mui/material';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { logo } from '../utils/constants';
import { SearchBar } from '.';
import { useCart } from '../context/CartProvider';
import * as Assets from '@video-cv/assets';

const Hamburger = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="52"
    height="24"
    viewBox="0 0 52 24"
  >
    <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
      <rect
        id="Rectangle_3"
        data-name="Rectangle 3"
        width="42"
        height="4"
        rx="2"
        transform="translate(304 47)"
        fill="#574c4c"
      />
      <rect
        id="Rectangle_5"
        data-name="Rectangle 5"
        width="42"
        height="4"
        rx="2"
        transform="translate(304 67)"
        fill="#574c4c"
      />
      <rect
        id="Rectangle_4"
        data-name="Rectangle 4"
        width="52"
        height="4"
        rx="2"
        transform="translate(294 57)"
        fill="#574c4c"
      />
    </g>
  </svg>
);

const Navbar = () => {
  const { cartState } = useCart();
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div
      className={`flex items-center px-10 sticky bg-white top-0 justify-center z-20 navbar`}
    >
      <div className="w-full mx-auto flex justify-between">
        <Link
          className=""
          to="/"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img src={Assets.Images.Logo} alt="logo" className="h-14" />
          {/* <h2 className="text-black text-2xl">Logo</h2> */}
        </Link>
        {/* <SearchBar /> */}
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Hamburger />
        </div>
        <div className={`nav-elements ${showNavbar && 'active'} items-center justify-center`}>
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
              >
                Find VideoCV
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
              >
                Job Board
              </NavLink>
            </li>
            <li>
              {/* TODO: Show logged in if user is logged in */}
              <button
                onClick={() => navigate('/cart')}
                className="border border-black rounded h-fit w-fit px-3 py-1 flex gap-2 items-center"
              >
                <img
                  alt=""
                  src={Assets.Icons.Cart}
                  className="w-[20px] h-[20px]"
                />
                - {cartState.cart.length} items
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
