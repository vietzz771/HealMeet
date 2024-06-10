import DoctorCard from './../../components/Doctors/DoctorCard';
import Testimonial from '../../components/Testimonial/Testimonial';
import useInstanceData from '../../hooks/useInstanceData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { useEffect, useState } from 'react';
import useScrollTop from '../../hooks/useScrollTop';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Doctor = () => {
  useDocumentTitle('HealMeet | Find a Doctor');
  useScrollTop();
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const handleSearch = () => {
    setQuery(query.trim());
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);
  const { data: doctors, loading, error } = useInstanceData(`doctors?query=${debounceQuery}`);
  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading"> Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Doctor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn mt-0 rounded-[0px] rounded-r-md hover:opacity-80"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <Loader />}
          {error && <Error />}
          {!loading && !error && (
            <div>
              {doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {doctors.map((doctor) => (
                    <DoctorCard doctor={doctor} key={doctor._id} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full py-10">
                  <p className="text-gray-500 text-lg">No doctors found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our patient say</h2>
            <p className="text__para text-center">
              Wold-class care for everyone. Our health System offers unmatched, expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Doctor;
