import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const options = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3056D3', '#ff4560', '#4CAF50'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },

  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#ff4560', '#4CAF50'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
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
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
  },
};

const ChartFour = ({ clinic, booking }) => {
  const [state, setState] = useState({ series: [] });
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const handleRadioChange = (index) => {
    setSelectedClinic(index);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    // Chọn nút đầu tiên
    if (clinic.length > 0) {
      if (selectedClinic === null) {
        setSelectedClinic(0);
      } else {
        const selectedClinicName = clinic[selectedClinic].name;
        const filteredBookings = booking.filter((b) => {
          const bookingYear = moment(b.timeSlot.date).year();
          return b.clinic.name === selectedClinicName && bookingYear === selectedYear;
        });

        const statusCounts = filteredBookings.reduce((acc, b) => {
          const month = moment(b.timeSlot.date).format('MMM');
          const status = b.status;
          if (!acc[status]) acc[status] = {};
          if (!acc[status][month]) acc[status][month] = 0;
          acc[status][month] += 1;
          return acc;
        }, {});

        const capitalizeFirstLetter = (string) => {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

        const series = Object.keys(statusCounts).map((status) => ({
          name: capitalizeFirstLetter(status),
          data: options.xaxis.categories.map((month) => statusCounts[status][month] || 0),
        }));

        const maxValue = Math.max(...series.flatMap((s) => s.data));
        setState({ series });
        options.yaxis.max = maxValue + 5;
      }
    }
  }, [selectedClinic, clinic, booking, selectedYear]);

  const currentYear = moment().year();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  return (
    <div className="sm:px-8 col-span-12 rounded-xl border border-stroke bg-white px-5 pb-1 pt-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-4 flex justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Monthly Booking Status{' '}
          </h4>
        </div>
        <div className="relative z-20 inline-block">
          <select
            name="year"
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                fill="#637381"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                fill="#637381"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex flex-wrap items-center gap-4">
          {clinic.map((location, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                checked={selectedClinic === index}
                onChange={() => handleRadioChange(index)}
                className=" mr-2 h-3 w-3 rounded-full"
              />
              <p className="font-semibold text-[#3C50E0]">{location.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div id="ChartFour" className="chart-container">
          <ReactApexChart options={options} series={state.series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartFour;
