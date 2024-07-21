import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import instance from '../../../utils/http';
import { toast } from 'react-toastify';
import { getToken } from '../../../config';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ManageAppointment() {
  useDocumentTitle('HealMeet | Admin');
  const token = getToken();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchAppointments = async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      setTimeout(() => {
        setAppointments(response.data);
        setIsLoadingData(false);
      }, 500);
    } catch (error) {
      console.error('There was an error fetching the appointments!', error);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, searchQuery]);

  const handleCancel = async (id) => {
    try {
      const res = await instance.put(
        'bookings',
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const { message } = await res.data;
      toast.success(message);
      fetchAppointments();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  const confirmCancelAppointment = (appointmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancel(appointmentId);
      }
    });
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for name or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {isLoadingData ? (
            <div className="flex items-center space-x-2">
              <FaSpinner className="animate-spin text-blue-500" />
              <span>Loading...</span>
            </div>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Patient Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Doctor Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Clinic
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((appointment) => (
                    <tr key={appointment._id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-base font-semibold">{appointment.user.name}</div>
                          <div className="font-normal text-gray-500">{appointment.user.email}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4">{appointment.doctor.name}</td>
                      <td className="px-6 py-4">{appointment.clinic.name}</td>
                      <td className="px-6 py-4">
                        {appointment.timeSlot.startingTime} - {appointment.timeSlot.endingTime}
                      </td>
                      <td className="px-6 py-4">{`${appointment.timeSlot.date} `}</td>
                      <td className="px-6 py-4">
                        {' '}
                        {appointment.status === 'pending' ? (
                          <p className="rounded-xl bg-blue-500 text-center text-white p-2">
                            Pending
                          </p>
                        ) : appointment.status === 'cancelled' ? (
                          <p className="rounded-xl bg-red-500 text-center text-white p-2">
                            Cancelled
                          </p>
                        ) : appointment.status === 'approved' ? (
                          <p className="rounded-xl bg-green-500 text-center text-white p-2">
                            Approved
                          </p>
                        ) : null}
                      </td>

                      <td className="px-6 py-4 ">
                        <button
                          className="px-2 py-1 border rounded-2xl bg-red-500 text-white hover:bg-red-400"
                          onClick={() => confirmCancelAppointment(appointment._id)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            {`Showing ${indexOfFirstItem + 1}-${indexOfLastItem} of ${appointments.length}`}
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <button
                  className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 dark:border-gray-700 ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-500 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white'
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </AdminLayout>
  );
}

export default ManageAppointment;
