import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AchievementDetail = () => {
    const { id } = useParams();
    const [achievement, setAchievement] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/achievements/${id}`)
            .then(response => setAchievement(response.data))
            .catch(error => console.error('Error fetching achievement details:', error));
    }, [id]);

    if (!achievement) {
        return <p>Loading...</p>;
    }

    // Split the description into paragraphs
    const descriptionParagraphs = achievement.description.split('\n').map((text, index) => (
        <p key={index} className="mt-2 text-lg text-gray-500">{text}</p>
    ));

    return (
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div id="about" className="relative bg-white overflow-hidden mt-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h2 className="my-6 text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
                                    {achievement.title}
                                </h2>
                                {descriptionParagraphs}
                            </div>
                        </main>
                    </div>
                    <div className="lg:w-1/2">
                        <img className="h-56 w-full object-cover object-top sm:h-72 md:h-96 lg:w-full lg:h-full" src={achievement.image} alt={achievement.title} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementDetail;
