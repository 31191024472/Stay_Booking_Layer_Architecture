import ImageCard from '../image-card/image-card';
import ImageCardSkeleton from '../image-card-skeleton/image-card-skeleton';
import { useNavigate } from 'react-router-dom';

/**
 * Thành phần hiển thị danh sách các điểm đến phổ biến với hình ảnh tương ứng.
 * @param {Object} props - Các thuộc tính của component.
 * @param {Object} props.popularDestinationsData - Dữ liệu về các điểm đến phổ biến.
 * @param {boolean} props.popularDestinationsData.isLoading - Xác định xem dữ liệu có đang tải không.
 * @param {Array<Object>} props.popularDestinationsData.data - Danh sách các đối tượng điểm đến phổ biến, mỗi đối tượng bao gồm:
 *    @param {number} props.popularDestinationsData.data[].code - Mã duy nhất của điểm đến.
 *    @param {string} props.popularDestinationsData.data[].name - Tên của điểm đến.
 *    @param {string} props.popularDestinationsData.data[].imageUrl - URL hình ảnh của điểm đến.
 * @param {Array<string>} props.popularDestinationsData.errors - Các lỗi xảy ra trong quá trình lấy dữ liệu.
 */

const PopularLocations = (props) => {
  const { popularDestinationsData } = props;
  const navigate = useNavigate();

  const onPopularDestincationCardClick = (city) => {
    navigate('/hotels', {
      state: {
        city: city.toString().toLowerCase(),
      },
    });
  };

  return (
    <div className="my-4">
      <h2 className="text-3xl font-medium text-slate-700 text-center">
      Đặt phòng khách sạn tại các điểm đến phổ biến
      </h2>
      <div className="flex my-4 gap-x-8 gap-y-4 justify-center flex-wrap">
        {popularDestinationsData.isLoading
          ? Array.from({ length: 5 }, (_, index) => (
              <ImageCardSkeleton key={index} />
            ))
          : popularDestinationsData.data.map((city) => (
              <ImageCard
                key={city.code}
                name={city.name}
                imageUrl={city.imageUrl}
                onPopularDestincationCardClick={onPopularDestincationCardClick}
              />
            ))}
      </div>
    </div>
  );
};
export default PopularLocations;