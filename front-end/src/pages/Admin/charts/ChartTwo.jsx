import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const ChartTwo = ({ users }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 420,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '85%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        title: {
          text: 'Number of Accounts',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => ` ${val}`,
        },
      },
      colors: ['#ff8c00', '#32cd32', '#4169e1', '#ff0000'],
    },
  });

  useEffect(() => {
    if (users.length > 0) {
      const monthCounts = Array(12).fill(0);

      const roles = ['admin', 'doctor', 'patient', 'superAdmin'];

      const roleCounts = {
        admin: Array(12).fill(0),
        doctor: Array(12).fill(0),
        patient: Array(12).fill(0),
        superAdmin: Array(12).fill(0),
      };

      const filteredUsers = users.filter((user) => {
        const userYear = new Date(user.createdAt).getFullYear();
        return userYear === selectedYear;
      });

      filteredUsers.forEach((user) => {
        const createdAt = new Date(user.createdAt);
        const month = createdAt.getMonth();
        const role = user.role;
        monthCounts[month]++;
        roleCounts[role][month]++;
      });

      const seriesData = roles.map((role) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1), // Chuyển đổi chữ cái đầu tiên thành chữ hoa
        data: roleCounts[role],
      }));

      setChartData((prevData) => ({
        ...prevData,
        series: seriesData,
      }));
    }
  }, [users, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const getYears = () => {
    const years = [];
    for (let i = 0; i < 3; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  return (
    <div
      id="chart"
      className="sm:px-7.5 col-span-12 rounded-xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5"
    >
      <div className="flex justify-end mb-2 mt-2">
        <select onChange={handleYearChange} value={selectedYear}>
          {getYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={chartData.options.chart.height}
      />
    </div>
  );
};

export default ChartTwo;
