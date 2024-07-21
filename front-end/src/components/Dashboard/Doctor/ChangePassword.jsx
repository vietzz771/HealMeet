import { useState } from 'react';
import { toast } from 'react-toastify';
import instance from '../../../utils/http';
import { getToken } from '../../../config';

const ChangePassword = () => {
  const token = getToken();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updatePasswordHandler = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const res = await instance.put(
        '/auth/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message);

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={updatePasswordHandler}>
        <div className="mb-5">
          <p className="form__label">Current Password*</p>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            className="form__input w-[75%]"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-5">
          <p className="form__label">New Password*</p>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="form__input w-[75%]"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-5">
          <p className="form__label">Confirm New Password*</p>
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            className="form__input w-[75%]"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] leading-[30px] py-3 px-4 rounded-lg w-[75%]"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
