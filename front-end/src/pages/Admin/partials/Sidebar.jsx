/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoWhite from '../../../assets/images/logoWhite.png';
import SidebarLinkGroup from './SidebarLinkGroup';
import { authContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUserMd } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { BsBarChart } from 'react-icons/bs';
import { GrSchedule } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import { RiLoginCircleLine } from 'react-icons/ri';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Successfully logged out!');
    navigate('/');
  };
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebarOpen || !sidebar.current || !trigger.current) return;
      if (sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`flex  absolute z-40 left-0 top-0 h-screen w-72.5 flex-col overflow-y-hidden shrink-0 bg-slate-800 p-3 transition-all  dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <NavLink to="/admin">
            <img src={logoWhite} alt="Logo" />
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg
              className="fill-slate-500"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* Links */}
        {/* Links */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div className="space-y-8">
            {/* Pages group */}
            <div>
              <h3 className="mb-4 ml-4 text-base font-semibold text-bodydark2">MENU</h3>
              <ul className="mt-3">
                {/* Dashboard */}
                <SidebarLinkGroup activecondition={pathname === '/admin'}>
                  {() => {
                    return (
                      <React.Fragment>
                        <NavLink
                          end
                          to="/admin"
                          className={({ isActive }) =>
                            'block transition duration-150 truncate ' +
                            (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                          }
                        >
                          <div
                            className={`block text-slate-200 truncate transition duration-150 ${
                              pathname === '/admin' ? 'hover:text-slate-200' : 'hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <BsBarChart className="w-5 h-5" />
                                <span className="font-medium text-bodydark1 ml-3 2xl:opacity-100 duration-200">
                                  Dashboard
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>

                {/*  Manage Account*/}
                <SidebarLinkGroup activecondition={pathname.includes('user')}>
                  {() => {
                    return (
                      <React.Fragment>
                        <NavLink
                          end
                          to="/admin/user"
                          className={({ isActive }) =>
                            'block transition duration-150 truncate ' +
                            (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                          }
                        >
                          <a
                            href="/admin/user"
                            className={`block text-slate-200 truncate transition duration-150 ${
                              pathname.includes('user')
                                ? 'hover:text-slate-200'
                                : 'hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaUser className="w-5 h-5" />

                                <span className=" font-medium text-bodydark1 ml-3   2xl:opacity-100 duration-200">
                                  Manage User
                                </span>
                              </div>
                            </div>
                          </a>
                        </NavLink>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/*  Manage Doctor*/}
                <SidebarLinkGroup activecondition={pathname.includes('doctor')}>
                  {() => {
                    return (
                      <React.Fragment>
                        <NavLink
                          end
                          to="/admin/doctor"
                          className={({ isActive }) =>
                            'block transition duration-150 truncate ' +
                            (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                          }
                        >
                          <a
                            href="#0"
                            className={`block text-slate-200 truncate transition duration-150 ${
                              pathname.includes('ecommerce')
                                ? 'hover:text-slate-200'
                                : 'hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaUserMd className="w-5 h-5" />

                                <span className=" font-medium text-bodydark1 ml-3   2xl:opacity-100 duration-200">
                                  Manage Doctor
                                </span>
                              </div>
                            </div>
                          </a>
                        </NavLink>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/*  Manage Appointment*/}
                <SidebarLinkGroup activecondition={pathname.includes('appointment')}>
                  {() => {
                    return (
                      <React.Fragment>
                        <NavLink
                          end
                          to="/admin/appointment"
                          className={({ isActive }) =>
                            'block transition duration-150 truncate ' +
                            (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                          }
                        >
                          <a
                            href="#0"
                            className={`block text-slate-200 truncate transition duration-150 ${
                              pathname.includes('ecommerce')
                                ? 'hover:text-slate-200'
                                : 'hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <GrSchedule className="w-5 h-5" />

                                <span className=" font-medium text-bodydark1 ml-3   2xl:opacity-100 duration-200">
                                  Manage Appointment
                                </span>
                              </div>
                            </div>
                          </a>
                        </NavLink>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>

                {/* Settings */}
                <SidebarLinkGroup activecondition={pathname.includes('settings')}>
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <a
                          href="#0"
                          className={`block text-slate-200 truncate transition duration-150 ${
                            pathname.includes('settings')
                              ? 'hover:text-slate-200'
                              : 'hover:text-white'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <IoSettingsOutline className="w-5 h-5" />
                              <span className=" font-medium text-bodydark1 ml-3   2xl:opacity-100 duration-200">
                                Settings
                              </span>
                            </div>
                            {/* Icon */}
                            <div className="flex shrink-0 ml-2">
                              <svg
                                className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                  open && 'rotate-180'
                                }`}
                                viewBox="0 0 12 12"
                              >
                                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                              </svg>
                            </div>
                          </div>
                        </a>
                        <div className=" lg:sidebar-expanded:block 2xl:block">
                          <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/admin/profile"
                                className={({ isActive }) =>
                                  'block transition duration-150 truncate ' +
                                  (isActive
                                    ? 'text-indigo-500'
                                    : 'text-slate-400 hover:text-slate-200')
                                }
                              >
                                <span className=" text-base font-medium text-bodydark1   2xl:opacity-100 duration-200">
                                  My Account
                                </span>
                              </NavLink>
                            </li>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/settings/notifications"
                                className={({ isActive }) =>
                                  'block transition duration-150 truncate ' +
                                  (isActive
                                    ? 'text-indigo-500'
                                    : 'text-slate-400 hover:text-slate-200')
                                }
                              >
                                <span className=" text-base font-medium text-bodydark1   2xl:opacity-100 duration-200">
                                  My Notifications
                                </span>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              </ul>
            </div>
            {/* More group */}
            <div>
              <h3 className="mb-4 ml-4 text-base font-semibold text-bodydark2">MORE</h3>
              <ul className="mt-3">
                {/* Authentication */}
                <SidebarLinkGroup>
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <a
                          href="#0"
                          className={`block text-slate-200 truncate transition duration-150 ${
                            open ? 'hover:text-slate-200' : 'hover:text-white'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <RiLoginCircleLine className="w-5 h-5" />
                              <span className=" font-medium text-bodydark1 ml-3   2xl:opacity-100 duration-200">
                                Authentication
                              </span>
                            </div>
                            {/* Icon */}
                            <div className="flex shrink-0 ml-2">
                              <svg
                                className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                  open && 'rotate-180'
                                }`}
                                viewBox="0 0 12 12"
                              >
                                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                              </svg>
                            </div>
                          </div>
                        </a>
                        <div className=" lg:sidebar-expanded:block 2xl:block">
                          <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/admin/change-password"
                                className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                              >
                                <span className=" text-base font-medium text-bodydark1   2xl:opacity-100 duration-200">
                                  Change Password
                                </span>
                              </NavLink>
                            </li>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/login"
                                onClick={handleLogout}
                                className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                              >
                                <span className=" text-base font-medium text-bodydark1   2xl:opacity-100 duration-200">
                                  Sign out
                                </span>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
