import { faLocationDot, faPerson } from '@fortawesome/free-solid-svg-icons';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import Input from 'components/ux/input/Input';

/**
 * Thành phần GlobalSearchBox
 * Hiển thị hộp tìm kiếm với các ô nhập liệu cho vị trí, số lượng khách và bộ chọn phạm vi ngày.
 * Bao gồm nút tìm kiếm để kích hoạt tìm kiếm dựa trên các tiêu chí đã nhập.
 *
 * @param {Object} props - Các thuộc tính đầu vào của component.
 * @param {string} props.locationInputValue - Giá trị hiện tại của ô nhập vị trí.
 * @param {string} props.numGuestsInputValue - Giá trị hiện tại của ô nhập số lượng khách.
 * @param {boolean} props.isDatePickerVisible - Cờ kiểm soát việc hiển thị bộ chọn ngày.
 * @param {Function} props.onLocationChangeInput - Hàm callback khi thay đổi ô nhập vị trí.
 * @param {Function} props.onNumGuestsInputChange - Hàm callback khi thay đổi ô nhập số lượng khách.
 * @param {Function} props.onDatePickerIconClick - Hàm callback khi nhấn vào biểu tượng bộ chọn ngày.
 * @param {Array} props.locationTypeheadResults - Kết quả gợi ý tự động khi nhập vị trí.
 * @param {Function} props.onSearchButtonAction - Hàm callback khi nhấn nút tìm kiếm.
 * @param {Function} props.onDateChangeHandler - Hàm callback khi thay đổi phạm vi ngày.
 * @param {Function} props.setisDatePickerVisible - Hàm callback để thay đổi trạng thái hiển thị của bộ chọn ngày.
 * @param {Object} props.dateRange - Phạm vi ngày đã chọn.
 */

const GlobalSearchBox = (props) => {
  const {
    locationInputValue,
    numGuestsInputValue,
    isDatePickerVisible,
    onLocationChangeInput,
    onNumGuestsInputChange,
    onDatePickerIconClick,
    locationTypeheadResults,
    onSearchButtonAction,
    onDateChangeHandler,
    setisDatePickerVisible,
    dateRange,
  } = props;
  return (
    <div className="flex flex-wrap flex-col lg:flex-row hero-content__search-box">
      <Input
        size="sm"
        value={locationInputValue}
        typeheadResults={locationTypeheadResults}
        icon={faLocationDot}
        onChangeInput={onLocationChangeInput}
      />
      <DateRangePicker
        isDatePickerVisible={isDatePickerVisible}
        onDatePickerIconClick={onDatePickerIconClick}
        onDateChangeHandler={onDateChangeHandler}
        setisDatePickerVisible={setisDatePickerVisible}
        dateRange={dateRange}
      />
      <Input
        size="sm"
        value={numGuestsInputValue}
        onChangeInput={onNumGuestsInputChange}
        placeholder="No. of guests"
        icon={faPerson}
        type="number"
      />
      <button
        className="w-full md:w-auto sb__button--secondary bg-brand-secondary hover:bg-yellow-600 px-4 py-2 text-white"
        onClick={onSearchButtonAction}
      >
        TÌM KIẾM
      </button>
    </div>
  );
};

export default GlobalSearchBox;