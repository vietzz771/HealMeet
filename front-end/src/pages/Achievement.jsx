import { useState, useEffect } from 'react';
import axios from 'axios';
import useScrollTop from '../hooks/useScrollTop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';

const Achievements = () => {
  useDocumentTitle('HealMeet | Achievements');
  useScrollTop();

  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Fetch achievements from the API
    axios
      .get('http://localhost:5000/api/achievements')
      .then((response) => setAchievements(response.data.data))
      .catch((error) => console.error('Error fetching achievements:', error));
  }, []);

  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
            Health Checkup Packages
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            We use an agile approach to test assumptions and connect with the needs of your audience
            early and often.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <article
              key={achievement._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              {achievement.image && (
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-48 object-cover object-center"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 text-gray-500 dark:text-gray-400">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                    <svg
                      className="mr-1 w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                    Package
                  </span>
                  <span className="text-sm">{new Date(achievement.date).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  <Link to={`/blogs/${achievement._id}`}>{achievement.title}</Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{achievement.content}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium dark:text-white">- {achievement.author}</span>
                  <Link
                    to={`/blogs/${achievement._id}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                  >
                    Read more
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
