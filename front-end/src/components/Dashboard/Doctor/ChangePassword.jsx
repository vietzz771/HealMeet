import { useState } from 'react';
import { toast } from 'react-toastify';
import instance from '../../../utils/http'; // Import your HTTP instance
import { getToken } from '../../../config'; // Import getToken function to retrieve JWT token

const ChangePassword = () => {
  const token = getToken(); // Retrieve JWT token from local storage or wherever it is stored

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

    // Validate new password and confirm password match
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      // Call API to update password
      const res = await instance.put(
        '/auth/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass JWT token in headers
        },
      );

      toast.success(res.data.message);

      // Clear form fields after successful update
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      // Handle API error
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">Change Password</h2>
      <form onSubmit={updatePasswordHandler}>
        <div className="mb-5">
          <p className="form__label">Current Password*</p>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            className="form__input"
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
            className="form__input"
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
            className="form__input"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
