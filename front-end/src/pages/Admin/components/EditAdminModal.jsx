/* eslint-disable react/prop-types */
import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

function EditAdminModal({ isOpen, onClose, user, onUpdateSuccess }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updatedUserData = {
        name,
        email
      };

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${user._id}`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onClose();
      onUpdateSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Main modal */}
      {isOpen && (
        <div 
          id="crud-modal" 
          tabIndex="-1" 
          aria-hidden="true" 
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit User
                </h3>
                <button 
                  type="button" 
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                  onClick={onClose}
                >
                  <IoClose className="w-3 h-3" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label 
                      htmlFor="name" 
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                 
               
                  <div className="col-span-2 sm:col-span-1">
                    <label 
                      htmlFor="email" 
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
               
                 
                 
                </div>
                <div className="flex items-center justify-between">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-blue-500" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <button
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
                      type="button"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditAdminModal;
