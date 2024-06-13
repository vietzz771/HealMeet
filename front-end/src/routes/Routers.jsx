import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Services from '../pages/Services';
import Signup from '../pages/Signup';
import Doctor from '../pages/Doctors/Doctor';
import DoctorDetails from '../pages/Doctors/DoctorDetails';
import MyAccount from '../components/Dashboard/User/MyAccount';
import Dashboard from '../components/Dashboard/Doctor/Dashboard';

import ProtectedRoute from './ProtectedRoute';

import { Routes, Route } from 'react-router-dom';
import DashboardAdmin from '../pages/Admin/pages/Dashboard';
import ManageAccountAdmin from '../pages/Admin/pages/MangeAccount';
import ManageDoctorAdmin from '../pages/Admin/pages/ManageDoctor';
import SuperAdmin from '../pages/Admin/pages/SuperAdmin';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<Doctor />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route
        path="/users/profile/me"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors/profile/me"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Admin */}
      <Route
        path="/admin/account"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageAccountAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageAccountAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctor"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageDoctorAdmin />
          </ProtectedRoute>
        }
      />
      {/* Super Admin */}
      <Route
        path="/super-admin/account"
        element={
          <ProtectedRoute allowedRoles={['superAdmin']}>
            <SuperAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={['superAdmin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Routers;
