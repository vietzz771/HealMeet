import Loading from '../../Loader/Loading';
import Error from '../../Error/Error';
import useGetBookings from '../../../hooks/useInstanceData';
import DoctorCard from '../../Doctors/DoctorCard';

const MyBookings = () => {
  const { data: appointment, loading, error } = useGetBookings('users/appointments/my-appointments');
  return (
    <div>
      {loading && <Loading />}
      {error && <Error errMessage={error} />}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {appointment.map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
      )}
      {!loading && !error && appointment.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">You did not book any doctor yet!</h2>
      )}
    </div>
  );
};

export default MyBookings;
