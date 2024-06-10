/* eslint-disable react/prop-types */
import { useState } from 'react';
import { RiMoreFill } from 'react-icons/ri';

const CardDataStats = ({ count, label, percentage, link }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
      <div className="flex justify-between mb-4">
        <div>
          <div className="flex items-center mb-1">
            <div className="text-2xl font-semibold">{count}</div>
            {percentage && (
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">
                {percentage}
              </div>
            )}
          </div>
          <div className="text-sm font-medium text-gray-400">{label}</div>
        </div>
        <div className="relative">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={toggleDropdown}
          >
            <RiMoreFill />
          </button>
          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 py-1.5 rounded-md bg-white border border-gray-100 shadow-md shadow-black/5 z-30 w-full max-w-[140px]">
              <li>
                <a
                  href="#"
                  className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                >
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
      <a href={link} className="text-[#f84525] font-medium text-sm hover:text-red-800">
        View
      </a>
    </div>
  );
};
export default CardDataStats;
