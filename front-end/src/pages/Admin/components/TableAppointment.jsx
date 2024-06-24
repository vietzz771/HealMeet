import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaSpinner } from 'react-icons/fa';

function TableAppointment({ doctors }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // const [doctors, setDoctors] = useState([]);
  // const [isLoadingData, setIsLoadingData] = useState(false);

  // const fetchDoctors = async () => {
  //   setIsLoadingData(true);
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://localhost:5000/api/doctors', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: {
  //         page: currentPage,
  //         limit: itemsPerPage,
  //       },
  //     });
  //     setTimeout(() => {
  //       setDoctors(response.data.data);
  //       setIsLoadingData(false);
  //     }, 500);
  //   } catch (error) {
  //     console.error('There was an error fetching the doctors!', error);
  //     setIsLoadingData(false);
  //   }
  // };

  useEffect(() => {
    // fetchDoctors();
  }, [currentPage]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortByKey = (timeSlots) => {
    return timeSlots.sort((a, b) => {
      const valueA =
        sortConfig.key === 'date'
          ? new Date(a[sortConfig.key])
          : a.doctor[sortConfig.key].toUpperCase();
      const valueB =
        sortConfig.key === 'date'
          ? new Date(b[sortConfig.key])
          : b.doctor[sortConfig.key].toUpperCase();
      if (sortConfig.direction === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };

  // Flatten the doctors array to get all timeSlots
  const flattenedTimeSlots = doctors.flatMap((doctor) =>
    doctor.timeSlots.map((timeSlot) => ({ ...timeSlot, doctor })),
  );

  const sortedTimeSlots = sortByKey([...flattenedTimeSlots]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(sortedTimeSlots.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="my-8">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {/* {isLoadingData ? (
            <div className="flex items-center space-x-2">
              <FaSpinner className="animate-spin text-blue-500" />
              <span>Loading...</span>
            </div>
          ) : ( */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
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
                <div className="flex items-center">Role</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Specialization</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Starting Time</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Ending Time</div>
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
            </tr>
          </thead>
          <tbody>
            {sortedTimeSlots.slice(indexOfFirstItem, indexOfLastItem).map((timeSlot, index) => (
              <tr
                key={`${timeSlot.doctor._id}-${index}`}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={timeSlot.doctor.photo}
                    alt={`${timeSlot.doctor.name} image`}
                  />
                  <div className="pl-3">
                    <div className="text-base font-semibold">{timeSlot.doctor.name}</div>
                    <div className="font-normal text-gray-500">{timeSlot.doctor.email}</div>
                  </div>
                </th>

                <td className="px-6 py-4">{capitalizeFirstLetter(timeSlot.doctor.role)}</td>
                <td className="px-6 py-4">
                  {capitalizeFirstLetter(timeSlot.doctor.specialization)}
                </td>
                <td className=" px-6 py-4">{timeSlot.startingTime}</td>
                <td className="px-6 py-4">{timeSlot.endingTime}</td>
                <td className="px-6 py-4">{timeSlot.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* )} */}
      </div>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">{`Showing ${
          indexOfFirstItem + 1
        }-${Math.min(indexOfLastItem, sortedTimeSlots.length)} of ${sortedTimeSlots.length}`}</span>
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
  );
}

export default TableAppointment;
