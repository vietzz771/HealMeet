import { useState, useEffect } from 'react';
import MyCalendar from '../components/MyCalendar';
import AdminLayout from '../layout/AdminLayout';
import moment from 'moment';
import { AiOutlineDelete } from 'react-icons/ai';
import axios from 'axios';
import TableAppointment from '../components/TableAppointment';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ManageAppointment() {
  const [date, setDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startingTime: '', endingTime: '' });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
    if (doctorId) {
      fetchTimeSlots(doctorId, date);
    } else {
      setAvailableSlots([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async (doctorId, selectedDate) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

      const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/slots`, {
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
      console.error('There was an error fetching the time slots!', error);
    } finally {
      setLoading(false);
    }
  };

  const createTimeSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/doctors/add-slot',
        {
          doctorId: selectedDoctor,
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
      fetchTimeSlots(selectedDoctor, date);
      setNewSlot({ startingTime: '', endingTime: '' });
    } catch (error) {
      console.error('Error adding time slot', error);
      // alert('Failed to add time slot. Please try again.');
      toast.error('Failed to add time slot. Please try again.');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchTimeSlots(selectedDoctor, date);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, date]);

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
    // if (!selectedDoctor) return alert('Please select a doctor');
    if (!selectedDoctor) {
      return toast.error('Please select a doctor');
    } else if (
      moment(selectedDate).isSame(currentDate, 'day') &&
      (isPastTime(date, newSlot.startingTime) || isPastTime(date, newSlot.endingTime))
    ) {
      toast.error('Cannot select past time for today');

      return setNewSlot({ startingTime: '', endingTime: '' });
    } else if (isTimeSlotOverlap(newSlot, availableSlots)) {
      toast.error('Time slot overlaps with existing slot');

      return setNewSlot({ startingTime: '', endingTime: '' });
    }

    createTimeSlots();
  };

  const deleteTimeSlot = async (e, index) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const slot = availableSlots[index];

      await axios.delete(`http://localhost:5000/api/doctors/${selectedDoctor}/delete-slot`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          doctorId: selectedDoctor,
          date: slot.date,
          startingTime: slot.startingTime,
          endingTime: slot.endingTime,
        },
      });

      fetchTimeSlots(selectedDoctor, date);
    } catch (error) {
      console.error('Error deleting time slot', error);
      // alert('Failed to delete time slot. Please try again.');
      toast.error('Failed to delete time slot. Please try again.');
    }
  };

  return (
    <AdminLayout>
      {loading && <FaSpinner className="animate-spin h-5 w-5 mx-auto" />}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <h3 className="text-2xl font-bold mb-8">Appointments</h3>
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
                <h4 className="text-lg font-semibold">Select Doctor</h4>
                <div className="flex items-center">
                  <label htmlFor="appDoctor" className="w-24 mr-2">
                    Doctor:
                  </label>
                  <select
                    id="appDoctor"
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                    className="block w-full flex-1 px-3 py-2 border rounded"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Available Slots</h4>

                <div className="space-y-4">
                  {availableSlots.map(
                    (slot, index) =>
                      slot && (
                        <div
                          key={index}
                          className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5"
                        >
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                    <div>
                      <p className="form__label">Starting Time*</p>
                      <input
                        type="time"
                        name="startingTime"
                        value={moment(newSlot.startingTime, 'hh:mm A').format('HH:mm') || ''}
                        className="block w-full flex-1 px-3 py-2 border rounded"
                        onChange={(e) =>
                          setNewSlot({
                            ...newSlot,
                            startingTime: moment(e.target.value, 'HH:mm').format('hh:mm A'),
                          })
                        }
                        min={
                          formatDateForDateInput(date) === formatDateForDateInput(new Date())
                            ? moment().format('HH:mm')
                            : '00:00'
                        }
                      />
                    </div>
                    <div>
                      <p className="form__label">Ending Time*</p>
                      <input
                        type="time"
                        name="endingTime"
                        value={moment(newSlot.endingTime, 'hh:mm A').format('HH:mm') || ''}
                        className="block w-full flex-1 px-3 py-2 border rounded"
                        onChange={(e) =>
                          setNewSlot({
                            ...newSlot,
                            endingTime: moment(e.target.value, 'HH:mm').format('hh:mm A'),
                          })
                        }
                        min={newSlot.startingTime}
                      />
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={addNewSlot}
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-8 relative"
                      >
                        Add Slot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <h3 className="text-2xl font-bold mb-8">Table Appointments Available</h3>
        <TableAppointment doctors={doctors} />{' '}
      </div>
    </AdminLayout>
  );
}

export default ManageAppointment;
