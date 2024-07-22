import React, { useState } from 'react';

import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import './Layout.scss';
// import { IUser, UserTypeEnum } from '@video-cv/models';
// import { closeSidebar } from '@video-cv/shared_store';
import * as Assets from '../../assets';
// import { IAppState } from 'apps/cloud-equipment/src/Store/store';
import { INavItem } from './types';

const Sidebar = ({
  userDetails,
  navlinks,
  sidebarExpanded,
  toggleSidebarExpanded,
  onLogout,
  sidebarOpen = false,
  closeSidebar = () => {},
}: {
  userDetails: any | null;
  navlinks: INavItem[];
  sidebarExpanded: boolean;
  toggleSidebarExpanded: () => void;
  onLogout: () => void;
  sidebarOpen?: boolean;
  closeSidebar?: () => void;
}) => {
  const handleCloseSidebar = () => {
    closeSidebar();
  };

  return (
    <aside
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

      {/* NOTE: only show for employers */}
      {false && (
        <Link to="/" className="text-base font-bold ml-4 hover:underline">
          Go to Home
        </Link>
      )}

      <Link to="/dashboard" className="logoAndName flex cursor-pointer mb-9">
        <img src={Assets.Images.Dragnet} alt="Facility Logo" className="h-14 rounded-md" />
        <h5 className="text-xl text-white">VideoCv</h5>
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
                  // expandIcon={<img src={Assets.Icons.WhiteArrowUp} alt="" />}
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
                      >
                        {item.img && <img className="w-5 icon" src={item.img} alt={item.name} />}
                        <span className="collapse-hideText">{item.name}</span>
                        {/* <img
                          className="hidden collapse-show"
                          src={item.img}
                          alt=""
                        /> */}
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
                className="!mt-2 main-icon text-white font-semibold"
              >
                {navItem.img && <img className="w-5 icon" src={navItem.img} alt={navItem.name} />}
                <span className="collapse-hideText">{navItem.name}</span>
              </NavLink>
            );
          }
        })}

        {/* logout common to all */}
      </div>

      {/* <div className="mt-10 flex justify-between items-center">
        <p
          className={`px-4 cursor-default text-xl font-bold ${
            sidebarExpanded ? '' : 'hidden'
          }`}
        >
          MESSAGES
        </p>
        <button
          className={`px-4 ${sidebarExpanded ? 'btn-icon' : 'hidden'}`}
        ></button>
      </div> */}

      <div className="messaging-holder mb-14 mt-10">
        <NavLink
          // onClick={handleCloseSidebar}
          to="https://wa.link/ev1zz4"
          className="messaging-navlink"
        >
          <a
            href="https://wa.link/ev1zz4"
            target="_blank"
            className="collapse-hideText text-white font-semibold underline"
          >
            Support
          </a>
        </NavLink>
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
        onClick={() => {
          onLogout();
          handleCloseSidebar();
        }}
        className="main-icon w-full flex justify-between mt-16"
      >
        {/* <img className="w-6" src={Assets.Icons.Logout} alt="" /> */}
        <span className="collapse-hideText">Logout</span>
        <LogoutIcon />
      </button>
    </aside>
  );
};

export default Sidebar;
