import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import { FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import AddHealthModal from '../components/AddHealthModal';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

// import EditHealthModal from '../components/EditHealthModal';

function HealthCheckUp() {
  useDocumentTitle('HealMeet | Admin');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [healths, setHealths] = useState([]);
  // const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  // const [selectedHeath, setSelectedHeath] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const fetchHealth = async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/bookingTicket`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      setTimeout(() => {
        setHealths(response.data.data);
        setIsLoadingData(false);
      }, 500);
    } catch (error) {
      console.error('There was an error fetching the doctors!', error);
      setIsLoadingData(false);
    }
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };
  useEffect(() => {
    fetchHealth();
  }, [currentPage, searchQuery]);

  // const capitalizeFirstLetter = (string) => {
  //   if (!string) return '';
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // };

  const addHealth = (open) => {
    setIsModalAddOpen(open);
  };
  const deleteHealth = async (healthId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${SERVER_URL}/api/bookingTicket/${healthId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchHealth();
    } catch (error) {
      console.error('There was an error deleting the health!', error);
    }
  };
  const confirmDeleteDoctor = (healthId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHealth(healthId);
      }
    });
  };
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const sortedHealths = [...healths].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredHealths = sortedHealths.filter((health) =>
    health.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredHealths.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
          <div>
            <button
              id="dropdownActionButton"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3 relative"
              type="button"
              onClick={addHealth}
            >
              Add Health Check-up
              <svg
                className="w-4 h-4 ml-1"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3C10.2652 3 10.5196 3.10536 10.7071 3.29289C10.8946 3.48043 11 3.73478 11 4V16C11 16.2652 10.8946 16.5196 10.7071 16.7071C10.5196 16.8946 10.2652 17 10 17C9.73478 17 9.48043 16.8946 9.29289 16.7071C9.10536 16.5196 9 16.2652 9 16V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3Z"
                  fill="currentColor"
                />
                <path
                  d="M3 10C3 9.73478 3.10536 9.48043 3.29289 9.29289C3.48043 9.10536 3.73478 9 4 9H16C16.2652 9 16.5196 9.10536 16.7071 9.29289C16.8946 9.48043 17 9.73478 17 10C17 10.2652 16.8946 10.5196 16.7071 10.7071C16.5196 10.8946 16.2652 11 16 11H4C3.73478 11 3.48043 10.8946 3.29289 10.7071C3.10536 10.5196 3 10.2652 3 10Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
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
              id="table-search-doctors"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for name"
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
                  <th scope="col" className="px-9 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      <svg
                        className="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Phone</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      <svg
                        className="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Ticket Number</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Message</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHealths.slice(indexOfFirstItem, indexOfLastItem).map((health) => (
                  <tr key={health._id} className="bg-white border-b hover:bg-gray-50">
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                    >
                      <div className="pl-3">
                        <div className="text-base font-semibold">{health.name}</div>
                        <div className="font-normal text-gray-500">{health.email}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{health.phone}</td>
                    <td className="px-6 py-4">{formatDate(health.date)}</td>

                    <td className="px-6 py-4">{health.ticketNumber}</td>
                    <td className="px-6 py-4" title={health.message}>
                      {health.message.length > 10
                        ? `${health.message.substring(0, 10)}...`
                        : health.message}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        className="text-red-600 hover:underline flex items-center"
                        onClick={() => {
                          confirmDeleteDoctor(health._id);
                        }}
                      >
                        <FaRegTrashAlt className="mr-1" />
                        Delete
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
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">{`Showing ${
            indexOfFirstItem + 1
          }-${indexOfLastItem} of ${healths.length}`}</span>
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

        {/* {isModalEditOpen && selectedHeath && (
          <EditHealthModal
            health={selectedHeath}
            isOpen={isModalEditOpen}
            onUpdateSuccess={fetchHealth}
            onClose={() => setIsModalEditOpen(false)}
          />
        )} */}
        {isModalAddOpen && (
          <AddHealthModal
            onAddSuccess={fetchHealth}
            isOpen={isModalAddOpen}
            onClose={() => setIsModalAddOpen(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default HealthCheckUp;
