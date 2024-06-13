  import useScrollTop from '../hooks/useScrollTop';
  import useDocumentTitle from '../hooks/useDocumentTitle';
  import emailjs from '@emailjs/browser';
  import { useRef, useState } from 'react';
  import { toast } from 'react-toastify';
  import HashLoader from 'react-spinners/HashLoader';

  const Contact = () => {
    useDocumentTitle('HealMeet | Contact');
    useScrollTop();

    const formRef = useRef();
    const [form, setForm] = useState({
      name: '',
      email: '',
      message: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { target } = e;
      const { name, value } = target;

      setForm({
        ...form,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);

      emailjs
        .send(
          import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
          {
            from_name: form.name,
            to_name: 'Q.Viet Dev',
            from_email: form.email,
            to_email: 'qviet.dev@gmail.com',
            message: form.message,
          },
          import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
        )
        .then(
          () => {
            setLoading(false);
            toast.success('Thank you. I will get back to you as soon as possible.');
            setForm({
              name: '',
              email: '',
              message: '',
            });
          },
          (error) => {
            setLoading(false);
            toast.error(error);
          },
        );
    };

    return (
      <section>
        <div className="px-4 mx-auto max-w-screen-md">
          <h2 className="heading text-center">Contact Us</h2>
          <p className="mb-8 lg:mb-16 font-light text-center text__para">
            Got a technical issue? Want to send feedback about a beta feature? Let us know.
          </p>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="form__label">Your Name</label>
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
            <div className="sm:col-span-2">
              <label htmlFor="message" className="form__label">
                Subject
              </label>
              <textarea
                type="text"
                rows="6"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Let us know how we can help you"
                className="form__input mt-1"
              />
            </div>
            <button type="submit" className="btn rounded sm:w-fit">
              {loading ? <HashLoader size={35} color="#ffffff" /> : 'Send'}
            </button>
          </form>
        </div>
      </section>
    );
  };

  export default Contact;
