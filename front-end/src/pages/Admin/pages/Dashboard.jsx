import { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AdminLayout from '../layout/AdminLayout';
import CardDataStats from '../components/CardDataStats';
import ChartOne from '../charts/ChartOne';
import ChartTwo from '../charts/ChartTwo';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  return (
    <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Welcome banner */}
        <WelcomeBanner />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats title="Total Account" total={users.length} rate="+3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-6 h-6 text-white"
            >
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"></path>
            </svg>
          </CardDataStats>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mt-4 md:mt-6 2xl:mt-7.5">
          <div className="col-span-12 lg:col-span-4">
            <ChartOne users={users} />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <ChartTwo users={users} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
