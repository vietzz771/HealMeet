import DoctorCard from './DoctorCard';
import useInstanceData from '../../hooks/useInstanceData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const DoctorList = () => {
  const { data: doctors, loading, error } = useInstanceData('doctors');
  return (
    <>
      {loading && <Loader />}
      {error && <Error />}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
          {doctors.slice(0, 3).map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
      )}
    </>
  );
};

export default DoctorList;
