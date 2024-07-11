/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import instance from '../../../utils/http';
import { getToken } from '../../../config';
import uploadImageToCloudinary from '../../../utils/uploadCloudinary';
import Loading from '../../Loader/Loading';
import { authContext } from '../../../context/authContext';

const Profile = ({ user }) => {
  const { dispatch } = useContext(authContext);

  const token = getToken();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    bloodType: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      gender: user.gender,
      bloodType: user.bloodType,
      photo: user.photo,
    });
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileInputChange = async (e) => {
    setImgLoading(true);
    try {
      const file = e.target.files[0];
      const data = await uploadImageToCloudinary(file);
      setFormData({ ...formData, photo: data?.url });
      console.log(data);
    } catch (error) {
      toast.error(error);
    } finally {
      setImgLoading(false);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.put(`users/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { message } = await res.data;
      setLoading(false);
      toast.success(message);
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          user: {
            ...authContext.user,
            ...formData,
          },
        },
      });
      navigate('/users/profile/me');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  return (
    <div className="mt-10">
      <form>
        <div className="mb-5 px-[30px] lg:px-0">
          <label className="text-headingColor font-bold text-[16px] leading-7">Full Name:</label>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor rounded-md shadow-md
                  cursor-pointer placeholder:text-textColor"
          />
        </div>
        <div className="mb-5 px-[30px] lg:px-0">
          <label className="text-headingColor font-bold text-[16px] leading-7">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor rounded-md shadow-md
                  cursor-pointer placeholder:text-textColor"
            aria-readonly
            readOnly
            disabled={true}
          />
        </div>
        <div className="mb-5 px-[30px] lg:px-0">
          <label className="text-headingColor font-bold text-[16px] leading-7">Blood Type:</label>
          <input
            type="text"
            placeholder="Blood Type"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor rounded-md shadow-md
                  cursor-pointer placeholder:text-textColor"
          />
        </div>
        <div className="mb-5 px-[30px] lg:px-0">
          <label className="text-headingColor font-bold text-[16px] leading-7">
            Gender:
            <select
              name="gender"
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              {imgLoading && <Loading />}
              {!imgLoading && <img src={formData.photo} alt="" className="w-full rounded-full" />}
            </figure>
          )}
          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>
        <div className="mt-7 px-[30px] lg:px-0">
          <button
            disabled={loading && true}
            type="submit"
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            onClick={submitHandler}
          >
            {loading ? <HashLoader size={35} color="#ffffff" /> : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
