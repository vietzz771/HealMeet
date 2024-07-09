import convertTime from '../../utils/convertTime';
import { useState } from 'react';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { Link } from 'react-router-dom';

const SidePanel = ({ doctorId, ticketPrice, timeSlots, clinics, loading, error }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [clinicActive, setClinicActive] = useState(null);
  const [selectedClinic, setselectedClinic] = useState(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [patientLocation, setPatientLocation] = useState('');

  const handleSlotClick = (index, slot) => {
    setActiveIndex(index);
    setSelectedTimeSlot(slot);
  };
  const handleClinicClick = (index, clinic) => {
    setClinicActive(index);
    setselectedClinic(clinic);
    if (clinic.name.toLowerCase() === 'at home') {
      setShowLocationInput(true);
    } else {
      setShowLocationInput(false);
    }
  };
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
              <button
                className={`flex-1 flex justify-between text-left p-2 border rounded ${
                  activeIndex === index ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                }`}
                onClick={() => handleSlotClick(index, item)}
              >
                <p className="text-[15px] leading-6 text-textColor font-semibold capitalize">
                  {item.day}
                </p>
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
                </p>
              </button>
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
                <button
                  className={`flex-1 flex justify-between text-left p-2 border rounded ${
                    clinicActive === index ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                  }`}
                  onClick={() => handleClinicClick(index, clinic)}
                >
                  <p className="text-[15px] leading-6 text-textColor font-semibold capitalize">
                    {clinic.name}
                  </p>
                  <p className="text-[15px] leading-6 text-textColor font-semibold capitalize">
                    {clinic.location}
                  </p>
                </button>
              </li>
            </ul>
          ))}
      </div>
      {showLocationInput && (
        <div className="mt-4">
          <p className="text__para mt-0 font-semibold text-headingColor">Patient Location:</p>
          <input
            type="text"
            value={patientLocation}
            onChange={(e) => setPatientLocation(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            placeholder="Enter your location"
          />
        </div>
      )}
      <Link to={`/payment/${doctorId}`}>
        <button className="btn px-2 w-full rounded-md">Book Appointment</button>
      </Link>
    </div>
  );
};

export default SidePanel;
