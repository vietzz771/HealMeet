const StepIndicator = ({ currentStep }) => {
  const steps = [
    { title: 'Details', description: 'Appoinment information' },
    { title: 'Payment', description: 'Show us the money.' },
    { title: 'Complete', description: "You're all set!" },
  ];
  return (
    <div>
      <ol className="grid grid-cols-1 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 text-sm sm:grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <li
              key={index}
              className={`flex items-center justify-center gap-2 p-4 ${
                isActive ? 'border-blue-500 bg-blue-100' : ''
              }`}
            >
              {isCompleted || currentStep === 3 ? (
                <svg
                  fill="#3b82f6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                >
                  <path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM11.52,17L6,12.79l1.83-2.37L11.14,13l4.51-5.08,2.24,2Z" />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {stepNumber === 1 && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  )}
                  {stepNumber === 2 && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  )}
                  {stepNumber === 3 && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  )}
                </svg>
              )}
              <p className="leading-none">
                <strong className="block font-bold text-[20px] mb-1"> {step.title} </strong>
                <small className="mt-1 text-[13px] text-gray-600"> {step.description} </small>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepIndicator;
