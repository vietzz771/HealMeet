import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import userImg from '../../assets/images/defaultAvatar.jpg'; // Default avatar, replace if needed

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const AchievementDetail = () => {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/achievements/${id}`)
      .then((response) => setAchievement(response.data))
      .catch((error) => console.error('Error fetching achievement details:', error));
  }, [id]);

  if (!achievement) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  // Split the description into paragraphs
  const descriptionParagraphs = achievement.description.split('\n').map((text, index) => (
    <p key={index} className="mt-2 text-lg text-gray-600 dark:text-gray-400">
      {text}
    </p>
  ));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formattedDate = formatDate(achievement.date);

  return (
    <main className="pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gray-100 dark:bg-gray-900 antialiased">
      <div className="px-4 mx-auto max-w-screen-xl">
        <article className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <header className="p-6 border-b border-gray-200 dark:border-gray-700">
            <address className="flex items-center mb-6">
              <img
                className="mr-4 w-16 h-16 rounded-full"
                src={userImg} // Replace with dynamic author image if available
                alt={achievement.author || 'Author'}
              />
              <div>
                <a
                  href="#"
                  rel="author"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {achievement.author || 'Author Name'}
                </a>

                <p className="text-base text-gray-600 dark:text-gray-400">
                  <time dateTime={achievement.date} title={formattedDate}>
                    {formattedDate}
                  </time>
                </p>
              </div>
            </address>
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white mb-4">
              {achievement.title}
            </h1>
          </header>
          <div className="p-6">
            <div className="prose dark:prose-invert">{descriptionParagraphs}</div>
            {achievement.image && (
              <figure className="mt-6">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full object-cover object-center h-72 sm:h-96"
                />
                <figcaption className="mt-2 text-center text-gray-500 dark:text-gray-400">
                  {achievement.imageCaption || 'HealMeet Hospital'}
                </figcaption>
              </figure>
            )}
          </div>
        </article>
      </div>
    </main>
  );
};

export default AchievementDetail;
