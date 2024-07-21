import { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AdminLayout from '../layout/AdminLayout';
import CardDataStats from '../components/CardDataStats';
import ChartOne from '../charts/ChartOne';
import ChartTwo from '../charts/ChartTwo';
import { FaUsers } from 'react-icons/fa';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { BsCashCoin } from 'react-icons/bs';

import useDocumentTitle from '../../../hooks/useDocumentTitle';
import moment from 'moment';
import ChartThree from '../charts/ChartThree';
import ChartFour from '../charts/ChartFour';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Dashboard() {
  useDocumentTitle('HealMeet | Admin');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [booking, setBooking] = useState([]);

  const [clinic, setClinic] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };
  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooking(response.data);

      if (Array.isArray(response.data)) {
        const today = moment().format('YYYY-MM-DD');
        const todayAppointments = response.data.filter(
          (booking) =>
            booking.timeSlot &&
            booking.timeSlot.date &&
            moment(booking.timeSlot.date).isSame(today, 'day'),
        );
        setAppointments(todayAppointments);
        const totalProfit = response.data.reduce((acc, booking) => {
          if (booking.status === 'approved' && booking.ticketPrice) {
            return acc + Number(booking.ticketPrice);
          }
          return acc;
        }, 0);
        setTotalProfit(totalProfit);
      } else {
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      console.error('There was an error fetching the bookings!', error);
    }
  };
  const fetchClinic = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/clinics/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClinic(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchBooking();
    fetchClinic();
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
          <CardDataStats title="Appointment Today" total={appointments.length} rate="+3">
            <RiCalendarScheduleLine size={25} />
          </CardDataStats>
          <CardDataStats title="Total Profit" total={`$${totalProfit}`} rate="+3">
            <BsCashCoin size={25} />
          </CardDataStats>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mt-4 md:mt-6 2xl:mt-7.5">
          <div className="col-span-12 lg:col-span-7">
            <ChartFour clinic={clinic} booking={booking} />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <ChartThree clinic={clinic} booking={booking} />
          </div>
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
