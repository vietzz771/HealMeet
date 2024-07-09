import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { PaymentContext } from '../../context/paymentContext';
import Loading from '../Loader/Loading';
import Error from '../Error/Error';
import convertTime from '../../utils/convertTime';

import starIcon from '../../assets/images/Star.png';

const Booking = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const { doctor, loading, error, clinics, cLoading, cError, setFormData } =
    useContext(PaymentContext);
  const { name, timeSlots, averageRating, totalRating, specialization, ticketPrice, photo } =
    doctor;
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [SlotActiveIndex, setSlotActiveIndex] = useState(null);
  // console.log(selectedDate);
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      clinic: clinics[0]?._id,
    }));
  }, [clinics]);

  const handleSelectionLocation = (clinic, index) => {
    setSelectedLocation(index);
    setFormData((prevData) => ({
      ...prevData,
      clinic: clinic?._id,
    }));
  };
  const handleSelectedDate = (date) => {
    setSelectedDate(date);
    setSlotActiveIndex(null);
    setFormData((prevData) => {
      // Destructure prevData to exclude timeSlot
      // eslint-disable-next-line no-unused-vars
      const { timeSlot, ...updatedData } = prevData;
      return updatedData;
    });
  };
  const handleTimeSlotClick = (timeSlot, index) => {
    setSlotActiveIndex(index);
    setFormData((prevData) => ({
      ...prevData,
      timeSlot,
    }));
  };
  const filteredTimeSlots = timeSlots?.filter((timeSlot) => timeSlot.day == selectedDate);
  return (
    <section className="pb-0">
      <div className="mx-auto">
        <div className="grid md:grid-cols-4 gap-[50px]">
          {loading && <Loading />}
          {error && <Error />}
          {!loading && !error && (
            <div className="md:col-span-2">
              <div className="flex items-center gap-5">
                <figure className="max-w-[200px] max-h-[200px]">
                  <img src={photo} alt="" className="w-full" />
                </figure>
                <div>
                  <span
                    className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px]
                leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded capitalize"
                  >
                    {specialization}
                  </span>
                  <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold capitalize">
                    {name}
                  </h3>
                  <div className="flex items-center gap-[6px]">
                    <span
                      className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px]
                lg:leading-7 font-semibold text-headingColor"
                    >
                      <img src={starIcon} alt="" /> {averageRating}
                    </span>
                    <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400]">
                      ({totalRating})
                    </span>
                  </div>
                  <p className="text__para mt-0 font-semibold capitalize">
                    ticket price:{' '}
                    <span className="text-[16px] pl-2 leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
                      $ {ticketPrice}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <div className="mx-auto grid max-w-screen-lg px-6">
              <div className="">
                <p className="text-[16px] font-semibold text-headingColor">Select a location</p>
                <div className="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2">
                  {cLoading && <Loading />}
                  {cError && <Error />}
                  {!cLoading &&
                    !cError &&
                    clinics?.map((clinic, index) => (
                      <div className="relative" key={index}>
                        <input
                          className="peer hidden"
                          id={`radio_${index}`}
                          type="radio"
                          name="radio"
                          checked={selectedLocation === index}
                          onChange={() => handleSelectionLocation(clinic, index)}
                        />
                        <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-blue-400"></span>
                        <label
                          className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-blue-100"
                          htmlFor={`radio_${index}`}
                          onClick={() => handleSelectionLocation(clinic, index)}
                        >
                          <span className="mt-2 font-bold">{clinic.name}</span>
                          {clinic.location && (
                            <span className="text-xs uppercase">{clinic.location}</span>
                          )}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="max-w-sm">
                <p className="mt-8 text-[16px] font-semibold text-headingColor">Select a date</p>
                <div className="mt-2">
                  <input
                    type="date"
                    name="endingDate"
                    value={selectedDate}
                    min={today}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="cursor-pointer px-[1rem] py-[0.75rem] rounded-lg border font-medium border-gray-300  text-headingColor outline-none ring-opacity-30 focus:ring focus:ring-blue-300 sm:text-sm"
                    onChange={(e) => handleSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="">
                <p className="mt-8 text-[16px] font-semibold text-headingColor">Select a time</p>
                <div className="mt-4 grid grid-cols-2 gap-2 lg:max-w-xl">
                  {filteredTimeSlots?.length > 0 ? (
                    filteredTimeSlots.map((timeSlot, index) => (
                      <button
                        key={index}
                        className={`rounded-lg border px-4 py-2 font-medium text-headingColor active:scale-95 ${
                          SlotActiveIndex === index
                            ? 'bg-blue-100 border-blue-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() => handleTimeSlotClick(timeSlot, index)}
                      >
                        {convertTime(timeSlot.startingTime)} - {convertTime(timeSlot.endingTime)}
                      </button>
                    ))
                  ) : (
                    <p>No schedule available for the selected date.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
