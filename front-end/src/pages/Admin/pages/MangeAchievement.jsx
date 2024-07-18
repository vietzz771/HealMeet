import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import { FaRegEdit, FaRegTrashAlt, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import AddAchievementModal from '../components/AddAchievementModal';
import EditAchievementModal from '../components/EditAchievementModal';

function ManageAchievement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedAchievement, setSelectedAchievement] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const fetchAchievements = async () => {
    setIsLoadingData(true);
    try {
      const response = await axios.get('http://localhost:5000/api/achievements', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      setTimeout(() => {
        setAchievements(response.data.data);
        setIsLoadingData(false);
      }, 500);
    } catch (error) {
      console.error('There was an error fetching the achievements!', error);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [currentPage, searchQuery]);

  const editAchievement = (achievementId, open) => {
    const achievement = achievements.find((ach) => ach._id === achievementId);
    setSelectedAchievement(achievement);
    setIsModalEditOpen(open);
  };

  const deleteAchievement = async (achievementId) => {
    try {
      await axios.delete(`http://localhost:5000/api/achievements/${achievementId}`);
      fetchAchievements(); // Refresh the achievements list after deletion
    } catch (error) {
      console.error('There was an error deleting the achievement!', error);
    }
  };

  const confirmDeleteAchievement = (achievementId) => {
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
        deleteAchievement(achievementId);
      }
    });
  };

  const filteredAchievements = achievements.filter((achievement) =>
    achievement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(achievements.length / itemsPerPage);

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
              onClick={() => setIsModalAddOpen(true)}
            >
              Add Achievement
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
              id="table-search-achievements"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for achievements"
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
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Author</th>
                  <th scope="col" className="px-6 py-3">Content</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Image</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAchievements.slice(indexOfFirstItem, indexOfLastItem).map((achievement) => (
                  <tr key={achievement._id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {achievement.title}
                    </th>
                    <td className="px-6 py-4">{achievement.author}</td>
                    <td className="px-6 py-4">{achievement.content}</td>

                    <td className="px-6 py-4">{new Date(achievement.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{achievement.description}</td>
                    <img class="rounded-full w-20 h-20" src={achievement.image} alt="image description" />

                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline" onClick={() => editAchievement(achievement._id, true)}>
                        <FaRegEdit className="mr-1" />
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline ml-4" onClick={() => confirmDeleteAchievement(achievement._id)}>
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
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">{`Showing ${indexOfFirstItem + 1}-${indexOfLastItem} of ${achievements.length}`}</span>
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
                  className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 dark:border-gray-700 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white'}`}
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

        {isModalEditOpen && selectedAchievement && (
          <EditAchievementModal
            achievement={selectedAchievement}
            isOpen={isModalEditOpen}
            onUpdateSuccess={fetchAchievements}
            onClose={() => setIsModalEditOpen(false)}
          />
        )}
        {isModalAddOpen && (
          <AddAchievementModal
            onAddSuccess={fetchAchievements}
            isOpen={isModalAddOpen}
            onClose={() => setIsModalAddOpen(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageAchievement;
