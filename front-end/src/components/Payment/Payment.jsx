import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { PaymentContext } from '../../context/paymentContext';

const Payment = () => {
  const { user, setFormData, doctor } = useContext(PaymentContext);
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const handlePaymentChange = (e) => {
    const method = e.target.id;
    const status = method === 'cash' ? 'pending' : 'completed';
    setSelectedPayment(method);
    setFormData((prevData) => ({ ...prevData, payment: { method, status } }));
  };
  const [userFormData, setUserFormData] = useState({
    name: user.name || '',
    email: user?.email || '',
    phone: user?.phone || null,
    address: user?.address || '',
  });
  useEffect(() => {
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setFormData((prevData) => ({
      ...prevData,
      user: user._id,
      userData: userFormData,
      payment: { method: selectedPayment, status: 'completed' },
    }));
  }, [user, setFormData, selectedPayment]);

  const handleInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...userFormData,
        [e.target.name]: e.target.value,
      },
    }));
  };
  return (
    <section className="antialiased pb-0">
      <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[16px] font-medium text-headingColor"
                  >
                    {' '}
                    Your name*{' '}
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    value={userFormData?.name}
                    className="block w-full rounded-lg border p-2.5 text-sm focus:ring focus:ring-blue-300 outline-none ring-opacity-30"
                    placeholder="Manchester United"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[16px] font-medium text-gray-900 "
                  >
                    {' '}
                    Your email*{' '}
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    value={userFormData?.email}
                    disabled
                    className="block w-full rounded-lg border p-2.5 text-sm text-headingColor focus:ring focus:ring-blue-300 outline-none ring-opacity-30"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[16px] font-medium text-gray-900 "
                  >
                    {' '}
                    Phone Number*{' '}
                  </label>
                  <div className="flex items-center">
                    <button
                      id="dropdown-phone-button-3"
                      data-dropdown-toggle="dropdown-phone-3"
                      className="z-10 inline-flex shrink-0 items-center rounded-s-lg border  px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300 outline-none ring-opacity-30"
                      type="button"
                    >
                      <svg
                        fill="none"
                        aria-hidden="true"
                        className="me-2 h-4 w-4"
                        viewBox="0 0 20 15"
                      >
                        <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                        <mask
                          id="a"
                          style={{ maskType: 'luminance' }}
                          width="20"
                          height="15"
                          x="0"
                          y="0"
                          maskUnits="userSpaceOnUse"
                        >
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                        </mask>
                        <g mask="url(#a)">
                          <rect width="20" height="15" fill="#DA251D" />
                          <path
                            fill="#FF0"
                            fillRule="evenodd"
                            d="M10 3.267L10.97 6.2l2.933.007-2.36 1.733.89 2.933-2.433-1.793L7.567 10.873l.867-2.933-2.36-1.733L9.033 6.2z"
                            clipRule="evenodd"
                          />
                        </g>
                      </svg>
                      +84
                    </button>

                    <div className="relative w-full">
                      <input
                        type="text"
                        name="phone"
                        onChange={handleInputChange}
                        value={userFormData.phone}
                        className="z-20 block w-full rounded-e-lg border border-s-0 p-2.5 text-sm focus:ring focus:ring-blue-300 outline-none ring-opacity-30"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="123-456-7890"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-[16px] font-medium text-gray-900 "
                  >
                    {' '}
                    Address*{' '}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={userFormData.address}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border p-2.5 text-sm text-headingColor focus:ring focus:ring-blue-300 outline-none ring-opacity-30"
                    placeholder="166 Da Nang"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
            <div className="flow-root">
              <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal">Subtotal</dt>
                  <dd className="text-base font-medium text-gray-900 ">$ {doctor?.ticketPrice}</dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal">Savings</dt>
                  <dd className="text-base font-medium text-green-500">0</dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-bold text-gray-900 ">Total</dt>
                  <dd className="text-base font-bold text-gray-900 ">$ {doctor?.ticketPrice}</dd>
                </dl>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
              <div className="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2">
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="stripe"
                    type="radio"
                    name="radio"
                    checked={selectedPayment === 'stripe'}
                    onChange={handlePaymentChange}
                  />
                  <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-blue-400"></span>
                  <label
                    className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-blue-100"
                    htmlFor="stripe"
                  >
                    <svg
                      width="53px"
                      height="50px"
                      fill="none"
                      viewBox="0 -11 70 70"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x=".5"
                        y=".5"
                        width="69"
                        height="47"
                        rx="5.5"
                        fill="#fff"
                        stroke="#000"
                      />
                      <path
                        d="m37.611 16.284-3.5559 0.7632v-2.883l3.5559-0.749v2.8688zm7.3948 1.597c-1.3884 0-2.2809 0.65-2.7767 1.1023l-0.1842-0.8762h-3.1167v16.478l3.5417-0.749 0.0142-3.9994c0.51 0.3674 1.2608 0.8903 2.5075 0.8903 2.5358 0 4.845-2.035 4.845-6.5149-0.0142-4.0983-2.3517-6.3311-4.8308-6.3311zm-0.8501 9.7369c-0.8358 0-1.3317-0.2967-1.6717-0.6642l-0.0141-5.243c0.3683-0.4098 0.8783-0.6924 1.6858-0.6924 1.2892 0 2.1817 1.4414 2.1817 3.2927 0 1.8937-0.8784 3.3069-2.1817 3.3069zm16.844-3.2645c0-3.6178-1.7567-6.4724-5.1142-6.4724-3.3716 0-5.4116 2.8546-5.4116 6.4442 0 4.2537 2.4083 6.4018 5.865 6.4018 1.6858 0 2.9608-0.3816 3.9241-0.9186v-2.8264c-0.9633 0.4805-2.0683 0.7773-3.4708 0.7773-1.3742 0-2.5925-0.4805-2.7483-2.1481h6.9275c0-0.0778 0.0051-0.2545 0.0109-0.4582v-2e-4 -3e-4c8e-3 -0.277 0.0174-0.6037 0.0174-0.7991zm-6.9984-1.3425c0-1.5969 0.9775-2.2611 1.87-2.2611 0.8642 0 1.785 0.6642 1.785 2.2611h-3.655zm-19.947-4.8897h3.5559v12.366h-3.5559v-12.366zm-4.0372 0 0.2267 1.0458c0.8358-1.5263 2.4933-1.2154 2.9466-1.0458v3.2504c-0.4391-0.1555-1.8558-0.3533-2.6916 0.7349v8.3803h-3.5417v-12.366h3.06zm-6.8569-3.0667-3.4567 0.7349-0.0141 11.32c0 2.0915 1.5725 3.6319 3.6691 3.6319 1.1617 0 2.0117-0.2119 2.4792-0.4663v-2.8688c-0.4533 0.1837-2.6917 0.8338-2.6917-1.2578v-5.0169h2.6917v-3.0101h-2.6917l0.0142-3.0667zm-8.3723 5.8932c-0.7509 0-1.2042 0.2119-1.2042 0.7631 0 0.6018 0.7802 0.8665 1.7481 1.1949 1.5779 0.5354 3.6548 1.24 3.6636 3.8502 0 2.5297-2.0259 3.9853-4.9725 3.9853-1.2184 0-2.5501-0.2403-3.8676-0.8055v-3.3635c1.19 0.6501 2.6917 1.1306 3.8676 1.1306 0.7933 0 1.36-0.212 1.36-0.8621 0-0.6665-0.8458-0.9712-1.8668-1.339-1.555-0.5602-3.5166-1.2669-3.5166-3.6213 0-2.5014 1.9125-3.9994 4.7884-3.9994 1.1758 0 2.3375 0.1837 3.5133 0.6501v3.321c-1.0767-0.5794-2.4367-0.9044-3.5133-0.9044z"
                        clipRule="evenodd"
                        fill="#6461FC"
                        fillRule="evenodd"
                      />
                    </svg>
                    <span className="mt-2 font-bold">Stripe</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="cash"
                    type="radio"
                    name="radio"
                    checked={selectedPayment === 'cash'}
                    onChange={handlePaymentChange}
                  />
                  <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-blue-400"></span>
                  <label
                    className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-blue-100"
                    htmlFor="cash"
                  >
                    <svg
                      width="50px"
                      height="50px"
                      fill="#000000"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <style>{`.cls-1{fill:#0dc93c;}`}</style>
                      </defs>
                      <path
                        className="cls-1"
                        d="M34,30H31a2,2,0,0,1,0-4h6a2,2,0,0,0,0-4H34V20a2,2,0,0,0-4,0v2.09A6,6,0,0,0,31,34h3a2,2,0,0,1,0,4H28a2,2,0,0,0,0,4h2v2a2,2,0,0,0,4,0V42a6,6,0,0,0,0-12Z"
                      />
                      <path
                        className="cls-1"
                        d="M54.9,9H9.1A6.11,6.11,0,0,0,3,15.1V48.9A6.11,6.11,0,0,0,9.1,55H54.9A6.11,6.11,0,0,0,61,48.9V15.1A6.11,6.11,0,0,0,54.9,9ZM57,48.9A2.1,2.1,0,0,1,54.9,51H9.1A2.1,2.1,0,0,1,7,48.9V15.1A2.1,2.1,0,0,1,9.1,13H54.9A2.1,2.1,0,0,1,57,15.1Z"
                      />
                    </svg>
                    <span className="mt-2 font-bold">Cash</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Payment;
