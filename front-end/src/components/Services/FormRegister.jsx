import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';

const FormRegister = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
  });

  const createBookingTicket = async (formData) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookingTicket/add-bookingTicket',
        formData,
      );
      if (response.data.success) {
        return response.data.data.ticketNumber;
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi hàm createBookingTicket để lưu thông tin đăng ký vào cơ sở dữ liệu và lấy ticketNumber
      const ticketNumber = await createBookingTicket(form);

      // Gửi email với ticketNumber qua EmailJS
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: 'HealMeet Hospital',
          to_name: form.name,
          from_email: 'thehoang1722@gmail.com',
          to_email: form.email,
          to_phone: form.phone,
          message: form.message,
          ticket_number: ticketNumber,
          to_date: form.date,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
      );

      setLoading(false);
      toast.success('Thank you. I will get back to you as soon as possible.');
      setForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        message: '',
      });
    } catch (error) {
      setLoading(false);
      toast.error('Booking failed. Please try again.');
      console.error('Booking error:', error);
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className=" p-5 lg:p-10 bg-white shadow-lg rounded-lg  border-2">
          <h2 className="lg:text-2xl md:text-2xl font-bold mb-5 text-start text__para ">
            Make an appointment
          </h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2">
                <div className="book__form--group space-y-4">
                  <div>
                    <label className="form__label ">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="What's your name?"
                      className="form__input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form__label">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className="form__input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form__label">Phone Number</label>
                    <input
                      type="number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="form__input mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="form__label">
                      Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      placeholder="Select date"
                      className="form__input mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className="form__label  block mb-1">
                  What advice do you have for the doctor?
                </span>
                <div className="input-group mb-2">
                  <textarea
                    name="message"
                    id="message"
                    className="form__input "
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Additional information"
                  ></textarea>
                </div>
                <div className="flex justify-center lg:justify-start mt-4">
                  <button
                    className=" bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300 sm:w-fit "
                    data-wow-duration="2s"
                  >
                    {loading ? <HashLoader size={35} color="#ffffff" /> : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormRegister;
