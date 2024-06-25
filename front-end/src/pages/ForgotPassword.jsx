import { useState } from 'react';
import { toast } from 'react-toastify';
import instance from '../utils/http';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post('/auth/forgot-password', { email });
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="max-w-[1170px] mx-auto rounded-md shadow-md md:p-10">
        <div className="flex justify-center items-center h-full">
          <div className="w-full lg:w-1/2">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Forgot Password
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor rounded-md shadow-md
                    cursor-pointer placeholder:text-textColor"
                  required
                />
              </div>
              <div className="mt-3">
                <button
                  type="submit"
                  className="bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
