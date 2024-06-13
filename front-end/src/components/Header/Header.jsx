import { useEffect, useRef, useCallback, useContext, useState } from 'react';
import logo from '../../assets/images/logo.png';
import userImg from '../../assets/images/defaultAvatar.jpg';
import { NavLink, Link } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import { authContext } from '../../context/authContext';
import { AiOutlineDown } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoMdLogOut } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  {
    path: '/home',
    display: 'Home',
  },
  {
    path: '/doctors',
    display: 'Find a Doctor',
  },
  {
    path: '/services',
    display: 'Services',
  },
  {
    path: '/contact',
    display: 'Contact',
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, role, token, dispatch } = useContext(authContext);
  const handleStickyHeader = useCallback(() => {
    if (window.scrollY > 80) {
      headerRef.current.classList.add('sticky__header');
    } else {
      headerRef.current.classList.remove('sticky__header');
    }
  }, []);
  console.log(user);
  const toggleMenu = () => menuRef.current.classList.toggle('sticky__menu');

  useEffect(() => {
    window.addEventListener('scroll', handleStickyHeader);
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, [handleStickyHeader]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const handleMenuItemClick = () => {
    setIsDropdownVisible(false);
  };
  const handleLogout = () => {
    setIsDropdownVisible(false);
    dispatch({ type: 'LOGOUT' });
    toast.success('Successfully logged out!');
    navigate('/');
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return role !== 'admin' ? (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? 'text-primaryColor text-[16px] leading-7 font-[600]'
                        : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-4 cursor-pointer" onClick={toggleDropdown}>
                  <h2 className="capitalize font-medium">{user?.name}</h2>
                  <figure className="w-[35px] h-[35px] rounded-full">
                    <img
                      src={user?.photo ? user.photo : userImg}
                      className="w-full rounded-full"
                      alt="user"
                    />
                  </figure>
                  <AiOutlineDown />
                </div>
                {isDropdownVisible && (
                  <div className="absolute top-[100%] right-[-20px] bg-white w-[170px] shadow-lg rounded-sm flex flex-col">
                    <Link
                      style={{ height: 'auto', lineHeight: 'normal' }}
                      className="py-4 px-4 border-b-2 flex justify-between font-medium hover:bg-gray-100"
                      to={`${role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me'}`}
                      onClick={handleMenuItemClick}
                    >
                      View Profile
                      <CgProfile className="self-center w-[20px] h-[20px]" />
                    </Link>
                    <h6
                      style={{ height: 'auto', lineHeight: 'normal' }}
                      className="py-4 px-4 flex justify-between font-medium cursor-pointer hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                      <IoMdLogOut className="self-center w-[20px] h-[20px]" />
                    </h6>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  ) : null;
};

export default Header;
