import convertTime from '../../utils/convertTime';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const SidePanel = ({ doctorId, ticketPrice, timeSlots, clinics, loading, error }) => {
  return (
    <div className="shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)] shadow-gray-400 p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} $
        </span>
      </div>
      <div className="mt-[30px] pb-3 border-b-2">
        <p className="text__para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <div className="flex-1 flex justify-between text-left p-2 border rounded">
                <p className="text-[15px] leading-6 text-textColor font-semibold capitalize">
                  {formatDate(item.date)}
                </p>
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-[30px] pb-3 border-b-2">
        <p className="text__para mt-0 font-semibold text-headingColor">Available Locations:</p>
        {loading && <Loader />}
        {error && <Error />}
        {!loading &&
          !error &&
          clinics?.map((clinic, index) => (
            <ul className="mt-3" key={index}>
              <li className="flex items-center justify-between mb-2">
                <div className="flex-1 flex justify-between text-left p-2 border rounded">
                  <p className="text-[15px] leading-6 text-textColor font-semibold capitalize">
                    {clinic.name}
                  </p>
                  <p className="text-[15px] leading-6 text-textColor font-semibold capitalize">
                    {clinic.location}
                  </p>
                </div>
              </li>
            </ul>
          ))}
      </div>
      <Link to={`/payment/${doctorId}`}>
        <button className="btn px-2 w-full rounded-md">Book Appointment</button>
      </Link>
    </div>
  );
};

export default SidePanel;
