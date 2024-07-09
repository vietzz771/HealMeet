import { useRef } from 'react';
import useScrollTop from '../hooks/useScrollTop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import heroImg03 from '../assets/images/doctor-img03.png';
import ServiceList from '../components/Services/ServiceList';
import FormRegister from '../components/Services/FormRegister';
import { Link } from 'react-router-dom';

const Services = () => {
  useDocumentTitle('HealMeet | Services');
  useScrollTop();

  const formRegisterRef = useRef(null);

  const scrollToFormRegister = () => {
    formRegisterRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero__section pt-[60px] 2xl:h-[650px]">
        <div className="container h-full">
          <div className="flex flex-col lg:flex-row gap-[40px] md:gap-[90px] items-center justify-between h-full">
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="lg:w-[870px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[40px] md:leading-[70px] text-center lg:text-left">
                  General health check
                </h1>
                <p className="text__para text-center lg:text-left">
                  Do not let your health become a secondary priority. Health is a solid launching
                  pad for every goal you aim for. Experience comprehensive healthcare today at
                  HealMeet Hospital! With a team of experienced doctors and medical experts, we are
                  committed to providing you with the quality general health examination service you
                  desire. Thereby helping you find balance both physically and mentally.
                </p>
              </div>
              <div className="mt-[20px] lg:mt-[30px] flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-[30px]">
                <div className="flex flex-col lg:flex-row gap-5 justify-center lg:justify-start">
                  <Link to="/contact" className="block">
                    <button className="btn hover:opacity-80 w-full lg:w-auto">
                      Get free consultation
                    </button>
                  </Link>
                  <button
                    className="btn hover:opacity-80 w-full lg:w-auto"
                    onClick={scrollToFormRegister}
                  >
                    Register now
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end w-full lg:w-1/2 h-full">
              <div className="max-w-[400px] md:max-w-[500px] lg:max-w-none h-auto">
                <img className="w-full h-full object-cover" src={heroImg03} alt="Health Campaign" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ServiceList />
      <div ref={formRegisterRef}>
        <FormRegister />
      </div>
    </>
  );
};

export default Services;
