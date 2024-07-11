/* eslint-disable react/prop-types */

const ServiceCard = ({ item }) => {
  const { title, desc1, desc2, desc3, desc4 } = item;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto p-5 sm:p-8  relative flex flex-col  lg:flex-row gap-[40px]">
        {/* Image column */}
        <div className="w-full lg:w-1/2 flex items-center justify-center md:justify-start mb-6 md:mb-0">
          <img
            src="https://hoanmy.com/vn/itodongnai/kham-suc-khoe-tong-quat/wp-content/uploads/2023/04/4Z5A0964.jpg" // Replace with your image path
            alt="Image Description"
            className="w-full h-auto md:max-h-full rounded-lg object-cover"
          />
        </div>
        {/* Content column */}
        <div className="w-full lg:w-1/2 flex items-center justify-center md:justify-start">
          <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal p-8">
            <h1 className="text-gray-900 font-bold text-3xl mb-2 text-center md:text-left">
              {title}
            </h1>
            <p className="text-gray-700 text-xs mt-2 text-center md:text-left">
              Written By:
              <a
                href="#"
                className="text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out"
              >
                The Hoang
              </a>
            </p>
            <p className="text-base leading-8 my-5 text-center md:text-left">{desc1}</p>
            <ul className="text-base leading-8 list-disc list-inside md:list-outside">
              <li>{desc2}</li>
              <li>{desc3}</li>
              <li>{desc4}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
