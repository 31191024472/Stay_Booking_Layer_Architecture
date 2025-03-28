import HeroCover from './components/hero-cover/HeroCover';
import PopularLocations from './components/popular-locations/popular-locations';
import { networkAdapter } from 'services/NetworkAdapter';
import { useState, useEffect, useCallback } from 'react';
import { MAX_GUESTS_INPUT_VALUE } from 'utils/constants';
import ResultsContainer from 'components/results-container/ResultsContainer';
import { formatDate } from 'utils/date-helpers';
import { useNavigate } from 'react-router-dom';
import _debounce from 'lodash/debounce';

/**
 * Thành phần trang chủ (Home) hiển thị trang chính của ứng dụng.
 * Bao gồm thanh điều hướng, ảnh bìa, các điểm đến phổ biến, kết quả tìm kiếm khách sạn và phần footer.
 */

const Home = () => {
  const navigate = useNavigate();

  // Biến trạng thái
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState('Hồ Chí Minh');
  const [numGuestsInputValue, setNumGuestsInputValue] = useState('');
  const [popularDestinationsData, setPopularDestinationsData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });
  const [hotelsResults, setHotelsResults] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // Trạng thái lưu trữ danh sách các thành phố có sẵn
  const [availableCities, setAvailableCities] = useState([]);

  const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);

  
  const debounceFn = useCallback(_debounce(queryResults, 1000), []);

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);

  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  const onLocationChangeInput = async (newValue) => {
    setLocationInputValue(newValue);
     // Sử dụng debounce để tránh gọi API quá nhiều lần
    debounceFn(newValue, availableCities);
  };

  /**
   * Truy vấn danh sách thành phố có sẵn dựa trên đầu vào của người dùng.
   * @param {string} query - Dữ liệu nhập vào của người dùng.
   * @returns {void}
   */
  function queryResults(query, availableCities) {
    const filteredResults = availableCities.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTypeheadResults(filteredResults);
  }

  const onNumGuestsInputChange = (numGuests) => {
    if (
      (numGuests < MAX_GUESTS_INPUT_VALUE && numGuests > 0) ||
      numGuests === ''
    ) {
      setNumGuestsInputValue(numGuests);
    }
  };

  const onDateChangeHandler = (ranges) => {
    setDateRange([ranges.selection]);
  };

  /**
   * Xử lý sự kiện khi người dùng nhấn nút tìm kiếm.
   * Lấy số lượng khách, ngày nhận/trả phòng và thành phố đã chọn từ state,
   * sau đó chuyển hướng đến trang '/hotels' với dữ liệu này.
   */
  const onSearchButtonAction = () => {
    const numGuest = Number(numGuestsInputValue);
    const checkInDate = formatDate(dateRange[0].startDate) ?? '';
    const checkOutDate = formatDate(dateRange[0].endDate) ?? '';
    const city = locationInputValue;
    navigate('/hotels', {
      state: {
        numGuest,
        checkInDate,
        checkOutDate,
        city,
      },
    });
  };

  useEffect(() => {
    /**
     * Lấy dữ liệu ban đầu cho trang Home.
     * @returns {Promise<void>} Một Promise hoàn thành khi dữ liệu được lấy.
     */
    const getInitialData = async () => {
      const popularDestinationsResponse = await networkAdapter.get(
        '/api/popularDestinations'
      );
      const hotelsResultsResponse =
        await networkAdapter.get('/api/nearbyHotels');

      const availableCitiesResponse = await networkAdapter.get(
        '/api/availableCities'
      );
      if (availableCitiesResponse) {
        setAvailableCities(availableCitiesResponse.data.elements);
      }

      if (popularDestinationsResponse) {
        setPopularDestinationsData({
          isLoading: false,
          data: popularDestinationsResponse.data.elements,
          errors: popularDestinationsResponse.errors,
        });
      }
      if (hotelsResultsResponse) {
        setHotelsResults({
          isLoading: false,
          data: hotelsResultsResponse.data.elements,
          errors: hotelsResultsResponse.errors,
        });
      }
    };
    getInitialData();
  }, []);

  return (
    <>
      <HeroCover
        locationInputValue={locationInputValue}
        numGuestsInputValue={numGuestsInputValue}
        locationTypeheadResults={filteredTypeheadResults}
        isDatePickerVisible={isDatePickerVisible}
        setisDatePickerVisible={setisDatePickerVisible}
        onLocationChangeInput={onLocationChangeInput}
        onNumGuestsInputChange={onNumGuestsInputChange}
        dateRange={dateRange}
        onDateChangeHandler={onDateChangeHandler}
        onDatePickerIconClick={onDatePickerIconClick}
        onSearchButtonAction={onSearchButtonAction}
      />
      <div className="container mx-auto">
        <PopularLocations popularDestinationsData={popularDestinationsData} />
        <div className="my-8">
          <h2 className="text-3xl font-medium text-slate-700 text-center my-2">
            Các khách sạn gần bạn được tuyển chọn
          </h2>
          <ResultsContainer
            hotelsResults={hotelsResults}
            enableFilters={false}
          />
        </div>
      </div>
    </>
  );
};

export default Home;