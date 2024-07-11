import { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from '../../utils/http';
import { getToken } from '../../config';
import HashLoader from 'react-spinners/HashLoader';

const FeedbackForm = ({ refetch }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const { id } = useParams();
  const token = getToken();
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await instance.get(`doctors/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserReview = res.data.data.find((review) => review.user._id === userId);
        setExistingReview(currentUserReview);
        setRating(currentUserReview?.rating || 0);
        setReviewText(currentUserReview?.reviewText || '');
      } catch (error) {
        console.error('Error fetching existing review:', error);
      }
    };

    fetchReview();
  }, [id, token, userId]);
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!rating || !reviewText) {
        setLoading(false);
        return toast.error('Rating & Review Fields are required');
      }
      const reviewData = { rating, reviewText };
      if (existingReview) {
        // Update existing review
        const res = await instance.put(
          `doctors/${id}/reviews`,
          { ...reviewData, reviewId: existingReview._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log(res);
        toast.success(res.data.message);
      } else {
        // Create new review
        const res = await instance.post(`doctors/${id}/reviews`, reviewData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        toast.success(res.data.message);
      }
      refetch();
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmitReview}>
      <div>
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          How would you rate the overall experience?*
        </h3>
        <div>
          {[...Array(5).keys()].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button
                key={ratingValue}
                type="button"
                className={`${
                  index < (hover || rating) ? 'text-yellowColor' : ' text-gray-400'
                } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-[30px]">
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-8">
          Share your feedback or suggestions*
        </h3>
        <textarea
          className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor
          w-full px-4 py-3 rounded-md "
          placeholder="Write your message"
          rows="5"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
      </div>
      <button type="submit" className="btn">
        {loading ? (
          <HashLoader size={25} color="#fff" />
        ) : existingReview ? (
          'Update Feedback'
        ) : (
          'Submit Feedback'
        )}
      </button>
    </form>
  );
};

export default FeedbackForm;
