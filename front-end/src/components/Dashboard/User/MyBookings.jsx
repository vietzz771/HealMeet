import Loading from '../../Loader/Loading';
import Error from '../../Error/Error';
import useGetBookings from '../../../hooks/useInstanceData';
import { formatDate } from '../../../utils/formatDate';
import { useState } from 'react';
import Modal from 'react-modal';
import instance from '../../../utils/http';
import { toast } from 'react-toastify';
import { getToken } from '../../../config';
import convertTime from '../../../utils/convertTime';

const MyBookings = () => {
  const token = getToken();
  const {
    data: appointment,
    loading,
    error,
  } = useGetBookings('users/appointments/my-appointments');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  console.log(appointment);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const handleCancel = async (id) => {
    try {
      const res = await instance.put(
        'bookings',
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const { message } = await res.data;
      toast.success(message);
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };
  return (
    <div>
      {loading && <Loading />}
      {error && <Error errMessage={error} />}
      {!loading && !error && (
        <table className="w-full text-left text-sm text-gray-500 mt-5">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Payment
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Booked on
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {appointment?.map((item) => (
              <tr key={item._id}>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <img src={item.doctor.photo} alt="" className="w-10 h-10 rounded-full" />
                  <div className="pl-3">
                    <div className="text-base font-semibold">{item.doctor.name}</div>
                  </div>
                </th>
                <td className="px-6 py-4 capitalize">
                  {item.status === 'pending' ? (
                    <p className="rounded-xl bg-blue-500 text-center text-white p-2">Pending</p>
                  ) : item.status === 'cancelled' ? (
                    <p className="rounded-xl bg-red-500 text-center text-white p-2">Cancelled</p>
                  ) : item.status === 'approved' ? (
                    <p className="rounded-xl bg-green-500 text-center text-white p-2">Approved</p>
                  ) : null}
                </td>
                <td className="px-6 py-4">
                  {item.payment.method == 'cash' ? (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p>Cash</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p>Paid</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-base">{item.ticketPrice} $</td>
                <td className="px-6 py-4">
                  <div className="text-center">
                    <p>{formatDate(item.timeSlot.date)}</p>
                    <p>
                      {convertTime(item.timeSlot.startingTime)} -{' '}
                      {convertTime(item.timeSlot.endingTime)}
                    </p>
                  </div>
                </td>
                <td className="py-4">
                  <button
                    className="px-2 py-1 border rounded-2xl bg-purple-400 text-white hover:bg-purple-200"
                    onClick={openModal}
                  >
                    Detail
                  </button>
                </td>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Confirmation Modal"
                  ariaHideApp={false}
                  style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    content: {
                      inset: '50% auto auto 50%',
                      transform: 'translate(-50%, -50%)',
                    },
                  }}
                >
                  <h2 className="text-xl mb-4 text-center font-bold">Appointment Details</h2>
                  <div className="flex justify-center items-center gap-x-10">
                    <img src={item?.doctor.photo} alt="" className="w-[100px] rounded-lg" />
                    <div>
                      <h3>Dr.{item?.doctor.name}</h3>
                      <h3 className="font-bold">{item.ticketPrice}$</h3>
                    </div>
                  </div>
                  <div className="mt-7 flex gap-x-5 items-center justify-around">
                    <div className="flex items-center">
                      <p className="font-bold">Payment method:</p>
                      <p className="capitalize ml-2 rounded-xl text-white p-2 bg-green-500">
                        {item?.payment.method}
                      </p>
                    </div>
                    <div>
                      {item.status === 'pending' ? (
                        <div className="flex items-center">
                          <p className="font-bold">Status:</p>
                          <p className="ml-2 rounded-xl bg-blue-500 text-center text-white p-2">
                            Pending
                          </p>
                        </div>
                      ) : item.status === 'cancelled' ? (
                        <div className="flex items-center">
                          <p className="font-bold">Status:</p>
                          <p className="ml-2 rounded-xl bg-red-500 text-center text-white p-2">
                            Cancelled
                          </p>
                        </div>
                      ) : item.status === 'approved' ? (
                        <div className="flex items-center">
                          <p className="font-bold">Status:</p>
                          <p className="ml-2 rounded-xl bg-green-500 text-center text-white p-2">
                            Approved
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-7 flex items-center gap-x-3">
                    <h3 className="font-bold">Address:</h3>
                    {item.clinic.name === 'HealMeet' ? (
                      <p>
                        {item.clinic.name} - {item.clinic.location}
                      </p>
                    ) : (
                      <p>
                        {item.clinic.name} - {item.userData.address}
                      </p>
                    )}
                  </div>
                  <div className="mt-7">
                    <div className="text-center">
                      <h3 className="font-bold">Time</h3>
                      <p>{formatDate(item.timeSlot.date)}</p>
                      <p>
                        {item.timeSlot.startingTime} - {item.timeSlot.endingTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-7">
                    <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={closeModal}>
                      Exit
                    </button>
                    {item.status === 'pending' && (
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleCancel(item._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </Modal>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && appointment.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          You did not book any doctor yet!
        </h2>
      )}
    </div>
  );
};

export default MyBookings;
