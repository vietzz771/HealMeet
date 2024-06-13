import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import SidebarSuperAdmin from '../partials/SidebarSuperAdmin';

function AdminLayout({ children, sidebarOpen, setSidebarOpen }) {
  const [role, setRole] = useState('');
  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, [role]);
  return (
    <Fragment>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {role === 'admin' ? (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : (
          <SidebarSuperAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Main content */}
          <main>{children}</main>
        </div>
      </div>
    </Fragment>
  );
}
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
export default AdminLayout;
