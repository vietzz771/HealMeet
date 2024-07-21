import { createContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useInstanceData from '../hooks/useInstanceData';
import useGetProfile from '../hooks/useInstanceData';

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const { data: user } = useGetProfile('users/profile/me');
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const { id } = useParams();
  const { data: doctor, loading, error } = useInstanceData(`doctors/${id}`);
  const { data: clinics, cLoading, cError } = useInstanceData(`clinics/`);
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      doctor: doctor?._id,
      ticketPrice: doctor?.ticketPrice,
    }));
  }, [doctor]);
  return (
    <PaymentContext.Provider
      value={{
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
        doctor,
        loading,
        error,
        clinics,
        cLoading,
        cError,
        user,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
