import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#6577F3', '#8FD0EF', '#0FADCF', '#508ac0'],
  labels: ['Patient', 'Doctor', 'Admin', 'SuperAdmin'],
  legend: {
    show: false,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartOne = ({ users = [] }) => {
  const [series, setSeries] = useState([0, 0, 0]);

  useEffect(() => {
    if (users.length > 0) {
      const adminCount = users.filter((user) => user.role === 'admin').length;
      const doctorCount = users.filter((user) => user.role === 'doctor').length;
      const patientCount = users.filter((user) => user.role === 'patient').length;
      const superAdminCount = users.filter((user) => user.role === 'superAdmin').length;

      setSeries([patientCount, doctorCount, adminCount, superAdminCount]);
    }
  }, [users]);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex mt-4">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Manage Account</h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="ChartOne" className="mx-auto flex justify-center">
          {users.length > 0 ? (
            <ReactApexChart options={options} series={series} type="donut" />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      {users.length > 0 && (
        <div className="flex flex-col items-center gap-y-3">
          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> Patient </span>
                <span> {((series[0] / users.length) * 100).toFixed(2)}% </span>
              </p>
            </div>
          </div>
          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> Doctor </span>
                <span> {((series[1] / users.length) * 100).toFixed(2)}% </span>
              </p>
            </div>
          </div>
          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> Admin </span>
                <span> {((series[2] / users.length) * 100).toFixed(2)}% </span>
              </p>
            </div>
          </div>
          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#508ac0]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> Super Admin </span>
                <span> {((series[3] / users.length) * 100).toFixed(2)}% </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartOne;
