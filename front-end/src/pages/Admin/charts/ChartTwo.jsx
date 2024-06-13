import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const ChartTwo = ({ users }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 500,
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

      users.forEach((user) => {
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
  }, [users]);

  return (
    <div id="chart">
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
