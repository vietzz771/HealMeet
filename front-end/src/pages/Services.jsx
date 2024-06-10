import { services } from '../assets/data/services';
import ServiceCard from '../components/Services/ServiceCard';
import useScrollTop from '../hooks/useScrollTop';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Services = () => {
  useDocumentTitle('HealMeet | Services');
  useScrollTop();
  return (
    <section>
      <div className="container">
        <div className="xl:w-[470px] mx-auto">
          <h2 className="heading text-center">Our medical services</h2>
          <p className="text__para text-center">
            Wold-class care for everyone. Our health System offers unmatched, expert health care.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px]">
          {services.map((item, index) => (
            <ServiceCard item={item} index={index} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
