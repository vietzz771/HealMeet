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
import ProtectedRouteAdmin from './ProtectedRouteAdmin';

import { Routes, Route } from 'react-router-dom';
import DashboardAdmin from "../pages/Admin/pages/Dashboard";
import ManageAccountAdmin from "../pages/Admin/pages/MangeAccount";
import MangeAdminAccount from '../pages/Admin/pages/MangeAdminAccount';
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
          <ProtectedRouteAdmin allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRouteAdmin>
        }
      />  
      <Route 
        path="/admin/account" 
        element={
          <ProtectedRouteAdmin allowedRoles={['admin']}>
            <ManageAccountAdmin />
          </ProtectedRouteAdmin>
        }
      />
{/* Super Admin */}
  <Route
  path="/super-admin/account"
  element={
    <ProtectedRoute allowedRoles={['superAdmin']}>
      <MangeAdminAccount />
    </ProtectedRoute>
  }
/>
 <Route 
      path="/super-admin" 
      element={
        <ProtectedRouteAdmin allowedRoles={['superAdmin']}>
          <DashboardAdmin />
        </ProtectedRouteAdmin>
      }
    />  
    <Route 
      path="/super-admin/account" 
      element={
        <ProtectedRouteAdmin allowedRoles={['superAdmin']}>
          <MangeAdminAccount />
        </ProtectedRouteAdmin>
      }
    />

 </Routes>

  );
};

export default Routers;
