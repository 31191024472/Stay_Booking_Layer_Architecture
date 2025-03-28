import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { AuthContext } from 'contexts/AuthContext';

/**
 * Thành phần cho phép người dùng đánh giá và viết nhận xét.
 *
 * @component
 * @param {Object} props - Các thuộc tính của component.
 * @param {number} props.userRating - Số sao mà người dùng đã chọn.
 * @param {Function} props.handleRating - Hàm xử lý khi người dùng thay đổi số sao.
 * @param {boolean} props.isEmpty - Cờ xác định xem phần nhận xét của người dùng có trống không.
 * @param {string} props.userReview - Nội dung nhận xét của người dùng.
 * @param {Function} props.handleReviewSubmit - Hàm xử lý khi người dùng gửi nhận xét.
 * @param {Function} props.handleUserReviewChange - Hàm xử lý khi người dùng thay đổi nội dung nhận xét.
 * @returns {JSX.Element} Thành phần hiển thị giao diện đánh giá của người dùng.
 */

const UserRatingsSelector = ({
  userRating,
  handleRating,
  isEmpty,
  userReview,
  handleReviewSubmit,
  handleUserReviewChange,
}) => {
  const { isAuthenticated } = React.useContext(AuthContext);

  return isAuthenticated ? (
    <div
      className={`${
        isEmpty ? 'md:w-full' : 'md:w-2/5'
      } pl-0 md:pl-4 md:border-l flex flex-col items-center justify-center`}
    >
      <div className="text-lg font-semibold text-gray-700">Đánh giá của bạn</div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= userRating ? fasStar : farStar}
            className={`cursor-pointer mx-1 text-2xl ${
              star <= userRating ? 'text-yellow-400' : 'text-gray-400'
            }`}
            onClick={() => handleRating(star)}
          />
        ))}
      </div>
      <textarea
        rows={3}
        className="w-full p-2 my-2 border"
        value={userReview}
        onChange={(e) => handleUserReviewChange(e.target.value)}
      />
      <button
        className="w-full px-4 py-2 my-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        onClick={handleReviewSubmit}
      >
        Gửi đánh giá
      </button>
    </div>
  ) : (
    <p className="font-semibold text-gray-700">
      Vui lòng đăng nhập để gửi đánh giá
    </p>
  );
};

export default UserRatingsSelector;