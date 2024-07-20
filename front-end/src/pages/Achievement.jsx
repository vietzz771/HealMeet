import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useScrollTop from '../hooks/useScrollTop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import heroImg03 from '../assets/images/doctor-img03.png';
import { Link } from 'react-router-dom';

const Achievements = () => {
  useDocumentTitle('HealMeet | Achievements');
  useScrollTop();

  const formRegisterRef = useRef(null);
  const [achievements, setAchievements] = useState([]);
  // const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch achievements from the API
    axios
      .get('http://localhost:5000/api/achievements')
      .then((response) => setAchievements(response.data.data))
      .catch((error) => console.error('Error fetching achievements:', error));
  }, []);

  return (
    <>
      <section className="hero__section pt-[60px] 2xl:h-[650px]">
        <div className="container h-full">
          <div className="flex flex-col lg:flex-row gap-[40px] md:gap-[90px] items-center justify-between h-full">
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="lg:w-[870px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[40px] md:leading-[70px] text-center lg:text-left">
                  Achievements
                </h1>
                <p className="text__para text-center lg:text-left">
                  Discover the remarkable achievements of our team at HealMeet Hospital. Our
                  dedicated professionals continually strive for excellence in healthcare.
                </p>
              </div>
              <div className="mt-[20px] lg:mt-[30px] flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-[30px]">
                <div className="flex flex-col lg:flex-row gap-5 justify-center lg:justify-start">
                  <Link to="/contact" className="block">
                    <button className="btn hover:opacity-80 w-full lg:w-auto">
                      Get free consultation
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end w-full lg:w-1/2 h-full">
              <div className="max-w-[400px] md:max-w-[500px] lg:max-w-none h-auto">
                <img className="w-full h-full object-cover" src={heroImg03} alt="Achievements" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="achievements__section mt-[60px]">
        <div className="container">
          <div className="flex flex-col items-center">
            <h2 className="text-[30px] font-[700] mb-[30px]">Our Achievements</h2>
            <div className="w-full max-w-[800px]">
              {achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="mb-[20px] p-[20px] border border-gray-300 rounded"
                >
                  <h3 className="text-[24px] font-[600]">{achievement.title}</h3>
                  <p className="mt-[10px]">{achievement.content}</p>
                  <p className="mt-[10px] text-right font-[500]">- {achievement.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div ref={formRegisterRef}></div>
    </>
  );
};

export default Achievements;
