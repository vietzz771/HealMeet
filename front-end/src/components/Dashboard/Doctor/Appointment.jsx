import { useState } from 'react';
import { formatDate } from '../../../utils/formatDate';
import Loading from '../../Loader/Loading';
import Error from '../../Error/Error';
import convertTime from '../../../utils/convertTime';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { getToken } from '../../../config';
import instance from '../../../utils/http';

const Appointment = ({ appointment, loading, error, refetch }) => {
  const token = getToken();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setStatus(item.status);
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const handleUpdate = async (id) => {
    console.log(id);
    const data = { id, status };
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers);
    console.log(data);
    try {
      const res = await instance.put('doctors/bookings/status', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { message } = await res.data;
      toast.success(message);
      refetch();
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
                  <img src={item?.user.photo} alt="" className="w-10 h-10 rounded-full" />
                  <div className="pl-3">
                    <div className="text-base font-semibold">{item.user.name}</div>
                    <div className="text-normal text-gray-500">{item.user.email}</div>
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
                  {item.payment.method === 'cash' ? (
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
                    onClick={() => openModal(item)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && appointment.length === 0 && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You do not have any appointment!
        </h2>
      )}

      {selectedItem && (
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
            <img src={selectedItem?.user.photo} alt="" className="w-[100px] rounded-lg" />
            <div>
              <h3>
                <span className="font-semibold">Name:</span> {selectedItem?.userData.name}
              </h3>
              <h3>
                <span className="font-semibold">Email:</span> {selectedItem?.userData.email}
              </h3>
              <h3>
                <span className="font-semibold">Phone:</span> {selectedItem?.userData.phone}
              </h3>
              <h3>
                <span className="font-semibold">Blood Type:</span> {selectedItem?.user.bloodType}
              </h3>
              <h3 className="font-bold">{selectedItem.ticketPrice}$</h3>
            </div>
          </div>
          <div className="mt-7 flex gap-x-5 items-center justify-around">
            <div className="flex items-center">
              <p className="font-bold">Payment method:</p>
              <p className="capitalize ml-2 rounded-xl text-white p-2 bg-green-500">
                {selectedItem?.payment.method}
              </p>
            </div>
          </div>
          <div className="mt-7 flex items-center gap-x-3">
            <h3 className="font-bold">Address:</h3>
            {selectedItem.clinic.name === 'HealMeet' ? (
              <p>
                {selectedItem.clinic.name} - {selectedItem.clinic.location}
              </p>
            ) : (
              <p>
                {selectedItem.clinic.name} - {selectedItem.userData.address}
              </p>
            )}
          </div>
          <div className="mt-7">
            <div className="text-center">
              <h3 className="font-bold">Time</h3>
              <p>{formatDate(selectedItem.timeSlot.date)}</p>
              <p>
                {convertTime(selectedItem.timeSlot.startingTime)} -{' '}
                {convertTime(selectedItem.timeSlot.endingTime)}
              </p>
            </div>
          </div>
          <div className="mt-7">
            <label htmlFor="status" className="font-bold">
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl p-2 px-3 border-2 ml-3 border-black"
            >
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div className="flex justify-end mt-7">
            <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={closeModal}>
              Exit
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleUpdate(selectedItem._id)}
            >
              Update
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Appointment;
