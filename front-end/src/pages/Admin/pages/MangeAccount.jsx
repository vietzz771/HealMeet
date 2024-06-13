import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';

import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';

function ManageAccount() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchUsers = async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      const filteredUsers = response.data.data.filter((user) => user.role !== 'doctor');

      setTimeout(() => {
        setUsers(filteredUsers);
        setIsLoadingData(false);
      }, 500);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
      setIsLoadingData(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const editUser = (userId, open) => {
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
    setIsModalEditOpen(open);
  };
  const addUser = (open) => {
    setIsModalAddOpen(open);
  };
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers(); // Cập nhật lại danh sách người dùng sau khi xóa
    } catch (error) {
      console.error('There was an error deleting the user!', error);
    }
  };
  const confirmDeleteUser = (userId) => {
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
        deleteUser(userId);
      }
    });
  };
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

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
              onClick={addUser}
            >
              Add User
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
              id="table-search-users"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for users"
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
                    <div className="flex items-center">
                      Name
                      <a href="#">
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Role</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Phone</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Gender</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Blood Type</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(indexOfFirstItem, indexOfLastItem).map((user) => (
                  <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.photo}
                        alt={`${user.name} image`}
                      />
                      <div className="pl-3">
                        <div className="text-base font-semibold">{user.name}</div>
                        <div className="font-normal text-gray-500">{user.email}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{capitalizeFirstLetter(user.role)}</td>
                    <td className="px-6 py-4">{user.phone}</td>

                    <td className="px-6 py-4">{capitalizeFirstLetter(user.gender)}</td>
                    <td className="px-6 py-4">{user.bloodType}</td>
                    <td className="px-6 py-4 ">
                      <button
                        className={`text-blue-600 hover:underline flex items-center ${
                          user.role === 'admin' || user.role === 'superAdmin'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        onClick={() => {
                          if (user.role !== 'admin' || user.role === 'superAdmin') {
                            editUser(user._id, true);
                          }
                        }}
                      >
                        <FaRegEdit className="mr-1" />
                        Edit
                      </button>
                    </td>
                    <td className="py-4">
                      <button
                        className={`text-red-600 hover:underline flex items-center ${
                          user.role === 'admin' || user.role === 'superAdmin'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        onClick={() => {
                          if (user.role !== 'admin' || user.role === 'superAdmin') {
                            confirmDeleteUser(user._id);
                          }
                        }}
                        disabled={user.role === 'admin' || user.role === 'superAdmin'}
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
          }-${indexOfLastItem} of ${users.length}`}</span>
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
                  className={`flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-300 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white ${
                    currentPage === index + 1 ? 'text-blue-600 bg-blue-600' : 'text-gray-500'
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

        {isModalEditOpen && selectedUser && (
          <EditUserModal
            user={selectedUser}
            isOpen={isModalEditOpen}
            onUpdateSuccess={fetchUsers}
            onClose={() => setIsModalEditOpen(false)}
          />
        )}
        {isModalAddOpen && (
          <AddUserModal
            onAddSuccess={fetchUsers}
            isOpen={isModalAddOpen}
            onClose={() => setIsModalAddOpen(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageAccount;
