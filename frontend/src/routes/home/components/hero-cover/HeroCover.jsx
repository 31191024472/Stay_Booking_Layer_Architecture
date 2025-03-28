import GlobalSearchBox from 'components/global-search-box/GlobalSearchbox';

/**
 * Thành phần HeroCover
 * Hiển thị phần tiêu đề lớn của trang chủ.
 * @param {Object} props - Các thuộc tính của component.
 * @param {String} props.locationInputValue - Giá trị nhập vị trí.
 * @param {String} props.numGuestsInputValue - Giá trị số lượng khách.
 * @param {Boolean} props.isDatePickerVisible - Trạng thái hiển thị bộ chọn ngày.
 * @param {Function} props.onLocationChangeInput - Hàm xử lý thay đổi vị trí nhập.
 * @param {Function} props.onNumGuestsInputChange - Hàm xử lý thay đổi số lượng khách.
 * @param {Object} props.dateRange - Đối tượng khoảng ngày.
 * @param {Function} props.onDateChangeHandler - Hàm xử lý thay đổi ngày.
 * @param {Function} props.onDatePickerIconClick - Hàm xử lý khi nhấn vào biểu tượng bộ chọn ngày.
 * @param {Function} props.onSearchButtonAction - Hàm xử lý khi nhấn nút tìm kiếm.
 * @param {Array} props.locationTypeheadResults - Danh sách gợi ý vị trí.
 * @param {Function} props.setisDatePickerVisible - Hàm thiết lập trạng thái hiển thị bộ chọn ngày.
 * @returns {JSX.Element} - Thành phần HeroCover.
 */


const HeroCover = (props) => {
  const {
    locationInputValue,
    numGuestsInputValue,
    isDatePickerVisible,
    onLocationChangeInput,
    onNumGuestsInputChange,
    dateRange,
    onDateChangeHandler,
    onDatePickerIconClick,
    onSearchButtonAction,
    locationTypeheadResults,
    setisDatePickerVisible,
  } = props;
  return (
    <div className="bg-brand min-h-[400px] md:min-h-72 lg:min-h-60 text-slate-100">
      <div className="hero-content__container flex flex-col items-center container mx-auto px-2 md:px-0">
        <></>
        <div className="hero-content__text py-4">
          <h3 className="text-4xl font-medium">
            Khám phá kỳ nghỉ hoàn hảo của bạn trên khắp Việt Nam
          </h3>
          <p className="my-1">
            Nhập ngày của bạn để xem giá mới nhất và bắt đầu hành trình thư giãn và phiêu lưu ngay hôm nay.
          </p>
        </div>
        <GlobalSearchBox
          locationInputValue={locationInputValue}
          locationTypeheadResults={locationTypeheadResults}
          numGuestsInputValue={numGuestsInputValue}
          isDatePickerVisible={isDatePickerVisible}
          setisDatePickerVisible={setisDatePickerVisible}
          onLocationChangeInput={onLocationChangeInput}
          onNumGuestsInputChange={onNumGuestsInputChange}
          dateRange={dateRange}
          onDateChangeHandler={onDateChangeHandler}
          onDatePickerIconClick={onDatePickerIconClick}
          onSearchButtonAction={onSearchButtonAction}
        />
      </div>
    </div>
  );
};

export default HeroCover;