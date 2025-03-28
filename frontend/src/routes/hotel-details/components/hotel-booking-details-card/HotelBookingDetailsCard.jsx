import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays } from 'date-fns';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import { networkAdapter } from 'services/NetworkAdapter';
import { DEFAULT_TAX_DETAILS } from 'utils/constants';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { formatPrice } from 'utils/price-helpers';
import Toast from 'components/ux/toast/Toast';
import format from 'date-fns/format';


/**
 * Một thành phần hiển thị chi tiết đặt phòng khách sạn, bao gồm khoảng thời gian lưu trú, 
 * loại phòng và giá cả.
 *
 * @param {Object} props - Các thuộc tính của thành phần.
 * @param {string} props.hotelCode - Mã duy nhất của khách sạn.
 */

const HotelBookingDetailsCard = ({ hotelCode }) => {
  // Trạng thái hiển thị bộ chọn ngày
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);

  const navigate = useNavigate();
    
  // Trạng thái thông báo lỗi
  const [errorMessage, setErrorMessage] = useState('');

  // Trạng thái khoảng thời gian đặt phòng
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  // Trạng thái cho loại phòng, số khách và số phòng được chọn
  const [selectedRoom, setSelectedRoom] = useState({
    value: '1 King Bed Standard Non Smoking',
    label: '1 Giường King Tiêu Chuẩn Không Hút Thuốc',
  });
  const [selectedGuests, setSelectedGuests] = useState({
    value: 2,
    label: '2 khách',
  });
  const [selectedRooms, setSelectedRooms] = useState({
    value: 1,
    label: '1 phòng',
  });

  // Trạng thái giá và chi tiết đặt phòng
  const [total, setTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [bookingPeriodDays, setBookingPeriodDays] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({});

  // Tuỳ chọn số lượng khách và phòng
  const guestOptions = Array.from(
    { length: bookingDetails.maxGuestsAllowed },
    (_, i) => ({ value: i + 1, label: `${i + 1} khách` })
  );
  const roomNumberOptions = Array.from(
    { length: bookingDetails.maxRoomsAllowedPerGuest },
    (_, i) => ({ value: i + 1, label: `${i + 1} phòng` })
  );
  const roomOptions = [
    {
      value: '1 King Bed Standard Non Smoking',
      label: '1 Giường King Tiêu Chuẩn Không Hút Thuốc',
    },
  ];

  // Xử lý khi thay đổi loại phòng
  const handleRoomTypeChange = (selectedOption) => {
    setSelectedRoom(selectedOption);
    calculatePrices();
  };
  const handleGuestsNumberChange = (selectedOption) => {
    setSelectedGuests(selectedOption);
  };
  const handleRoomsNumberChange = (selectedOption) => {
    setSelectedRooms(selectedOption);
    calculatePrices();
  };

   // Xử lý bật/tắt bộ chọn ngày
  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  /**
   * Xử lý thay đổi ngày đặt phòng. Cập nhật số ngày lưu trú và tính lại giá.
   *
   * @param {Object} ranges - Khoảng thời gian đã chọn.
   */

  const onDateChangeHandler = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    const days =
      startDate && endDate
        ? differenceInCalendarDays(endDate, startDate) + 1
        : 1;
    setBookingPeriodDays(days);
    calculatePrices();
  };

  /**
   * Tính toán tổng giá và thuế dựa trên loại phòng đã chọn và thời gian đặt phòng.
   */
  const calculatePrices = () => {
    const pricePerNight = bookingDetails.currentNightRate * selectedRooms.value;
    const gstRate =
      pricePerNight <= 2500 ? 0.05 : pricePerNight > 7500 ? 0.08 : 0.1;
    const totalGst = (pricePerNight * bookingPeriodDays * gstRate).toFixed(2);
    const totalPrice = (
      pricePerNight * bookingPeriodDays +
      parseFloat(totalGst)
    ).toFixed(2);
    if (!isNaN(totalPrice)) {
      setTotal(`${formatPrice(totalPrice)} VNĐ`);
    }
    setTaxes(`${formatPrice(totalGst)} VNĐ`);
  };

  const onBookingConfirm = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      setErrorMessage('Vui lòng chọn ngày nhận phòng và trả phòng.');
      return;
    }
    const checkIn = format(dateRange[0].startDate, 'dd-MM-yyyy');
    const checkOut = format(dateRange[0].endDate, 'dd-MM-yyyy');
    const queryParams = {
      hotelCode,
      checkIn,
      checkOut,
      guests: selectedGuests.value,
      rooms: selectedRooms.value,
      hotelName: bookingDetails.name.replaceAll(' ', '-'), 
    };

    const url = `/checkout?${queryString.stringify(queryParams)}`;
    navigate(url, {
      state: {
        total,
        checkInTime: bookingDetails.checkInTime,
        checkOutTime: bookingDetails.checkOutTime,
      },
    });
  };

   // Xử lý ẩn thông báo lỗi
  const dismissError = () => {
    setErrorMessage('');
  };

  // Tính giá ban đầu khi thay đổi các trạng thái liên quan
  useEffect(() => {
    calculatePrices();
    
  }, [bookingPeriodDays, selectedRooms, selectedRoom, bookingDetails]);

  // Lấy dữ liệu chi tiết đặt phòng
  useEffect(() => {
    const getBookingDetails = async () => {
      const response = await networkAdapter.get(
        `api/hotel/${hotelCode}/booking/enquiry`
      );
      if (response && response.data) {
        setBookingDetails(response.data);
      }
    };
    getBookingDetails();
  }, [hotelCode]);

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Chi tiết đặt phòng</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        {/* Total Price */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Tổng giá
          </div>
          <div className="text-xl font-bold text-indigo-600">{total}</div>
          <div className="text-sm text-green-600">
            {bookingDetails.cancellationPolicy}
          </div>
        </div>

        {/* Dates & Time */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Ngày & giờ</div>
          <div className="text-gray-600">
            <DateRangePicker
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerIconClick={onDatePickerIconClick}
              onDateChangeHandler={onDateChangeHandler}
              setisDatePickerVisible={setisDatePickerVisible}
              dateRange={dateRange}
              inputStyle="DARK"
            />
          </div>
        </div>

        {/* Xác nhận đặt phòng */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Xác nhận đặt phòng</div>
          <Select
            value={selectedRooms}
            onChange={handleRoomsNumberChange}
            options={roomNumberOptions}
            className="mb-2"
          />
          <Select
            value={selectedGuests}
            onChange={handleGuestsNumberChange}
            options={guestOptions}
          />
        </div>

        {/* Room Type */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Loại phòng</div>
          <Select
            value={selectedRoom}
            onChange={handleRoomTypeChange}
            options={roomOptions}
          />
        </div>

        {/* Per day rate */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Giá theo ngày</div>
          <div className="text-gray-600">
            {formatPrice(bookingDetails.currentNightRate)} VNĐ
          </div>
        </div>

        {/* Taxes */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Thuế</div>
          <div className="text-gray-600">{taxes}</div>
          <div className="text-xs text-gray-500">{DEFAULT_TAX_DETAILS}</div>
        </div>

        {errorMessage && (
          <Toast
            type="error"
            message={errorMessage}
            dismissError={dismissError}
          />
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onBookingConfirm}
          className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-yellow-600 transition duration-300"
        >
          Xác nhận đặt phòng
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;