import { Link } from 'react-router-dom';

const Complete = () => {
  return (
    <div className="container">
      <div className="flex items-center justify-center flex-col mt-5 gap-y-3">
        <div className="w-14 h-14">
          <svg
            fill="#47e160"
            stroke="#47e160"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m854.34 1317.7-351.14-351.14 79.85-79.85 271.28 271.28 520.21-520.32 79.849 79.962-600.06 600.06zm105.71-1317.7c-529.36 0-960 430.64-960 960s430.64 960 960 960c529.24 0 960-430.64 960-960s-430.76-960-960-960z"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-headingColor font-semibold text-[30px]">Booking success!</h2>
      </div>
      <div className="text-center mt-5">
        <h3>Check your booking details</h3>
        <Link to="/users/profile/me">
          <button className="btn hover:opacity-80 mt-2">Booking Details</button>
        </Link>
      </div>
    </div>
  );
};

export default Complete;
