import { useState } from 'react';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AdminLayout from '../layout/AdminLayout';
import CardDataStats from '../components/CardDataStats';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Welcome banner */}
        <WelcomeBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <CardDataStats count="100" label="Users" percentage="+30%" link="/admin/account" />
          <CardDataStats count="100" label="Companies" percentage="+30%" link="/dierenartsen" />
          <CardDataStats count="100" label="Companies" percentage="+30%" link="/dierenartsen" />
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
