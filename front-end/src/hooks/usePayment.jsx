import { useContext } from 'react';
import { PaymentContext } from '../context/paymentContext';
import instance from '../utils/http';
import { getToken } from '../config';
import { toast } from 'react-toastify';

const usePayment = () => {
  const token = getToken();
  const { formData, setFormData, currentStep, setCurrentStep } = useContext(PaymentContext);

  const handleNext = async () => {
    if (currentStep === 2 && formData.payment.method == 'cash') {
      try {
        const res = await instance.post('bookings', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { message } = await res.data;
        console.log(res);
        toast.success(message);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      }
      setCurrentStep(3);
      return;
    } else if (currentStep === 2 && formData.payment.method == 'stripe') {
      try {
        console.log(token);
        const res = await instance.post(
          `bookings/checkout-session/${formData.doctor}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.data;
        if (!(res.status >= 200 && res.status < 300)) {
          toast.error(res.data.message);
        }
        if (data.session.url) {
          window.location.href = data.session.url;
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      }
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return { formData, setFormData, currentStep, handleNext, handleBack };
};

export default usePayment;
