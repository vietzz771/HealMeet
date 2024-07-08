import PaymentForm from './PaymentForm';
import PaymentProvider from '../context/paymentContext';

const PaymentFormWrapper = () => {
  return (
    <PaymentProvider>
      <PaymentForm />
    </PaymentProvider>
  );
};

export default PaymentFormWrapper;
