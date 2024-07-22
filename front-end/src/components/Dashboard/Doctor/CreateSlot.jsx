import { useState, useEffect } from 'react';
import MyCalendar from '../../../pages/Admin/components/MyCalendar';
import moment from 'moment';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AiOutlineDelete } from 'react-icons/ai';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function DoctorCreateSlots() {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startingTime: '', endingTime: '' });
  const [loading, setLoading] = useState(false);

  const fetchTimeSlots = async (selectedDate) => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (!userString) {
        console.error('User not found in local storage');
        return;
      }

      const user = JSON.parse(userString);
      const doctorId = user._id;

      if (!doctorId) {
        console.error('Doctor ID not found in user object');
        return;
      }

      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

      const response = await axios.get(`${SERVER_URL}/api/doctors/${doctorId}/slots`, {
        params: { date: formattedDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const slotsForSelectedDate = response.data.timeSlots.filter((slot) =>
        moment(slot.date).isSame(selectedDate, 'day'),
      );

      setAvailableSlots(slotsForSelectedDate);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to fetch time slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTimeSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (!userString) {
        console.error('User not found in local storage');
        return;
      }

      const user = JSON.parse(userString);
      const doctorId = user._id;

      if (!doctorId) {
        console.error('Doctor ID not found in user object');
        return;
      }
      console.log(doctorId);

      await axios.post(
        `${SERVER_URL}/api/doctors/add-slot`,
        {
          doctorId: doctorId,
          date: moment(date).format('YYYY-MM-DD'),
          startingTime: moment(newSlot.startingTime, 'hh:mm A').format('hh:mm A'),
          endingTime: moment(newSlot.endingTime, 'hh:mm A').format('hh:mm A'),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchTimeSlots(date);
      setNewSlot({ startingTime: '', endingTime: '' });
    } catch (error) {
      console.error('Error adding time slot', error);
      toast.error('Failed to add time slot. Please try again.');
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      // const user = JSON.parse(userString);
      // const doctorId = user._id;
      fetchTimeSlots(date);
    }
  }, [date]);

  const formatDateForDateInput = (dateOfJoining) => {
    return moment(new Date(dateOfJoining)).format('YYYY-MM-DD');
  };

  const getformDate = (mydate) => {
    const parts = mydate.split('-');
    return new Date(+parts[0], parts[1] - 1, +parts[2], 12);
  };

  const isPastTime = (date, time) => {
    const selectedDateTime = moment(date).set({
      hour: moment(time, 'hh:mm A').hour(),
      minute: moment(time, 'hh:mm A').minute(),
    });
    return selectedDateTime.isBefore(moment());
  };

  const isTimeSlotOverlap = (newSlot, slots) => {
    const newStartTime = moment(newSlot.startingTime, 'hh:mm A');
    const newEndTime = moment(newSlot.endingTime, 'hh:mm A');

    return slots.some((slot) => {
      const startTime = moment(slot.startingTime, 'hh:mm A');
      const endTime = moment(slot.endingTime, 'hh:mm A');
      return (
        (newStartTime.isSameOrAfter(startTime) && newStartTime.isBefore(endTime)) ||
        (newEndTime.isAfter(startTime) && newEndTime.isSameOrBefore(endTime)) ||
        (newStartTime.isSameOrBefore(startTime) && newEndTime.isSameOrAfter(endTime))
      );
    });
  };

  const addNewSlot = () => {
    const currentDate = moment();
    const selectedDate = moment(date);
    const userString = localStorage.getItem('user');
    const startTimeMoment = moment(newSlot.startingTime, 'HH:mm');
    const endTimeMoment = moment(newSlot.endingTime, 'HH:mm');
    if (!userString) {
      return toast.error('User not identified');
    }

    const user = JSON.parse(userString);
    const doctorId = user._id;

    if (!doctorId) {
      return toast.error('Doctor not identified');
    }

    if (
      moment(selectedDate).isSame(currentDate, 'day') &&
      (isPastTime(date, newSlot.startingTime) || isPastTime(date, newSlot.endingTime))
    ) {
      toast.error('Cannot select past time for today');
      return setNewSlot({ startingTime: '', endingTime: '' });
    } else if (isTimeSlotOverlap(newSlot, availableSlots)) {
      toast.error('Time slot overlaps with existing slot');
      return setNewSlot({ startingTime: '', endingTime: '' });
    } else if (endTimeMoment.isBefore(startTimeMoment)) {
      toast.error('End time cannot be earlier than start time');
      return setNewSlot({ startingTime: '', endingTime: '' });
    }

    createTimeSlots();
  };

  const deleteTimeSlot = async (e, index) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (!userString) {
        console.error('User not found in local storage');
        return;
      }

      const user = JSON.parse(userString);
      const doctorId = user._id;
      const slot = availableSlots[index];

      await axios.delete(`${SERVER_URL}/api/doctors/${doctorId}/delete-slot`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          doctorId: doctorId,
          date: slot.date,
          startingTime: slot.startingTime,
          endingTime: slot.endingTime,
        },
      });

      fetchTimeSlots(date);
    } catch (error) {
      console.error('Error deleting time slot', error);
      toast.error('Failed to delete time slot. Please try again.');
    }
  };

  return (
    <div>
      {loading && <FaSpinner className="animate-spin h-5 w-5 mx-auto" />}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <h3 className="text-2xl font-bold mb-8">Create Slots</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="lg:col-span-1 lg:col-start-1">
            <div className="max-w-screen-md mx-auto">
              <MyCalendar date={date} setDate={setDate} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Select Date</h4>
                <div className="flex items-center">
                  <label htmlFor="appDate" className="w-24 mr-2">
                    Date:
                  </label>
                  <input
                    id="appDate"
                    name="appDate"
                    type="date"
                    className="flex-1 px-3 py-2 border rounded"
                    value={formatDateForDateInput(date)}
                    onChange={(e) => setDate(getformDate(e.target.value))}
                    min={moment().format('YYYY-MM-DD')}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Available Slots</h4>

                <div className="space-y-4">
                  {availableSlots.map(
                    (slot, index) =>
                      slot && (
                        <div key={index} className="flex items-center space-x-4">
                          <div>
                            <p className="form__label">Starting Time*</p>
                            <input
                              type="time"
                              name="startingTime"
                              value={
                                moment(
                                  slot.startingTime,
                                  'hh:mm A                             ',
                                ).format('HH:mm') || ''
                              }
                              className="block w-full flex-1 px-3 py-2 border rounded"
                              disabled
                            />
                          </div>
                          <div>
                            <p className="form__label">Ending Time*</p>
                            <input
                              type="time"
                              name="endingTime"
                              value={moment(slot.endingTime, 'hh:mm A').format('HH:mm') || ''}
                              className="block w-full flex-1 px-3 py-2 border rounded"
                              disabled
                            />
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => deleteTimeSlot(e, index)}
                              className="bg-red-600 p-2 rounded-full text-white test-[18px] cursor-pointer mt-8"
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Add New Slot</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label htmlFor="startTime" className="w-24">
                      Start Time:
                    </label>
                    <input
                      id="startTime"
                      name="startTime"
                      type="time"
                      className="flex-1 px-3 py-2 border rounded"
                      value={newSlot.startingTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startingTime: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label htmlFor="endTime" className="w-24">
                      End Time:
                    </label>
                    <input
                      id="endTime"
                      name="endTime"
                      type="time"
                      className="flex-1 px-3 py-2 border rounded"
                      value={newSlot.endingTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endingTime: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  onClick={addNewSlot}
                >
                  Add Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorCreateSlots;
