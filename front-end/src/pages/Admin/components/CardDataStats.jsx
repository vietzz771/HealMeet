// CardDataStats.js

const CardDataStats = ({ title, total, children }) => {
  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
      <div className="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-blue-600 from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
        {children}
      </div>

      <div className="p-4 text-right">
        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
          {title}
        </p>
        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
          {total}
        </h4>
      </div>
    </div>
  );
};

export default CardDataStats;
