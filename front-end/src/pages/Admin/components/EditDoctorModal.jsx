/* eslint-disable no-case-declarations */
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import uploadImageToCloudinary from '../../../utils/uploadCloudinary';
import { LuUpload } from 'react-icons/lu';

function EditDoctorModal({ isOpen, onClose, doctor, onUpdateSuccess }) {
  const [name, setName] = useState(doctor.name);
  const [email, setEmail] = useState(doctor.email);
  const [role, setRole] = useState(doctor.role);
  const [gender, setGender] = useState(doctor.gender);
  const [ticketPrice, setTicketPrice] = useState(doctor.ticketPrice);
  const [specialization, setSpecialization] = useState(doctor.specialization);
  const [phone, setPhone] = useState(doctor.phone);
  const [photo, setPhoto] = useState(doctor.photo);
  const [isApproved, setIsApproved] = useState(doctor.isApproved);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updatedDoctorData = {
        name,
        email,
        role,
        gender,
        phone,
        photo,
        ticketPrice,
        specialization,
        isApproved,
      };

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/doctors/${doctor._id}`, updatedDoctorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onClose();
      onUpdateSuccess();
    } catch (error) {
      console.error('Error updating doctor:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileInputChange = async (e) => {
    setIsLoading(true);
    try {
      const file = e.target.files[0];
      const data = await uploadImageToCloudinary(file);
      console.log(data);
      setPhoto(data?.url);
    } catch (error) {
      console.error(error);
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
          <div className="relative p-4 w-full max-w-md max-h-full ">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Doctor</h3>
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
                {/* Form fields */}
                <div className="grid gap-4 mb-4 grid-cols-2">
                  {/* Name */}
                  <div className="col-span-2 sm:col-span-1">
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
                  {/* Email */}
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
                  {/* Role */}
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>
                  {/* Gender */}
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  {/* Phone */}
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  {/* Approval Status */}
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="isApproved"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Approval Status
                    </label>
                    <select
                      id="isApproved"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={isApproved}
                      onChange={(e) => setIsApproved(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {/* specialization */}
                  <div className="col-span-2">
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      id="specialization"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    />
                  </div>
                  {/* specialization */}
                  <div className="col-span-2">
                    <label
                      htmlFor="ticketPrice"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Ticket Price
                    </label>
                    <input
                      type="number"
                      name="ticketPrice"
                      id="ticketPrice"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className=" col-span-2 flex items-center gap-3">
                    {photo && (
                      <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                        {isLoading && <FaSpinner />}
                        {!isLoading && <img src={photo} alt="" className="w-full rounded-full" />}
                      </figure>
                    )}
                    <div className="relative w-[130px] h-[50px]">
                      <input
                        type="file"
                        name="photo"
                        id="customFile"
                        onChange={handleFileInputChange}
                        accept=".jpg, .png"
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <label
                        htmlFor="customFile"
                        className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden  font-semibold rounded-lg truncate cursor-pointer"
                      >
                        Upload Photo
                        <LuUpload className="ml-1 w-4 h-4 flex-shrink-0" />
                      </label>
                    </div>
                  </div>
                  {/* Save changes and Cancel buttons */}
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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditDoctorModal;
