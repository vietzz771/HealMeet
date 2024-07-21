import Loading from '../../Loader/Loading';
import Error from '../../Error/Error';
import useGetBookings from '../../../hooks/useInstanceData';
import { formatDate } from '../../../utils/formatDate';
import { useState } from 'react';
import Modal from 'react-modal';
import instance from '../../../utils/http';
import { toast } from 'react-toastify';
import { getToken } from '../../../config';

const MyBookings = () => {
  const token = getToken();
  const {
    data: appointment,
    loading,
    error,
  } = useGetBookings('users/appointments/my-appointments');
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
                      {item.timeSlot.startingTime} - {item.timeSlot.endingTime}
                    </p>
                  </div>
                </td>
                <td className="py-4">
                  <button
                    className="px-2 py-1 border rounded-2xl bg-red-500 text-white hover:bg-red-400"
                    onClick={openModal}
                  >
                    Cancel
                  </button>
                </td>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Confirmation Modal"
                  ariaHideApp={false}
                  style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    content: { inset: '50% auto auto 50%', transform: 'translate(-50%, -50%)' },
                  }}
                >
                  <h2 className="text-xl mb-4">Are you sure you want to cancel?</h2>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={closeModal}>
                      No
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleCancel(item._id)}
                    >
                      Yes
                    </button>
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
