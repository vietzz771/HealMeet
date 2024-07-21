import banner from '../../../../assets/images/welcomeBanner.png';

function WelcomeBanner() {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center w-full h-72 p-6 sm:p-12 rounded-3xl mb-8"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="text-white w-full sm:w-1/2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">Welcome back, Admin. 👋</h2>
        <br />
        <div className="border-b border-gray-300 my-2"></div>
        <p className="text-xs sm:text-sm lg:text-base">
          At HealMeet, we believe that every patient deserves the highest quality care possible.
        </p>
        <br />
        <p className="text-xs sm:text-sm lg:text-base">
          Our commitment to excellence in healthcare is matched only by our compassion for those we
          serve.
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
