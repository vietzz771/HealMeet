import Booking from '../components/Payment/Booking';
import Payment from '../components/Payment/Payment';
import Complete from '../components/Payment/Complete';
import StepIndicator from '../components/Payment/StepIndicator';
import usePayment from '../hooks/usePayment';

const PaymentForm = () => {
  const { currentStep, handleNext, handleBack } = usePayment();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Booking />;
      case 2:
        return <Payment />;
      case 3:
        return <Complete />;
      default:
        return <Booking />;
    }
  };

  return (
    <div className="container mt-10">
      <StepIndicator currentStep={currentStep} />
      {renderStep()}
      <div className="flex justify-center gap-x-4 mt-4">
        {currentStep > 1 && currentStep < 3 && (
          <button className="btn bg-gray-200 px-10 py-2 text-headingColor" onClick={handleBack}>
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button className="btn bg-blue-500 text-white px-10 py-2" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
