import { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AdminLayout from '../layout/AdminLayout';
import CardDataStats from '../components/CardDataStats';
import ChartOne from '../charts/ChartOne';
import ChartTwo from '../charts/ChartTwo';
import { FaUsers } from 'react-icons/fa';
import { RiCalendarScheduleLine } from 'react-icons/ri';

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
            <FaUsers size={25} />
          </CardDataStats>
          <CardDataStats title="Appointment Today" total={0} rate="+3">
            <RiCalendarScheduleLine size={25} />
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
