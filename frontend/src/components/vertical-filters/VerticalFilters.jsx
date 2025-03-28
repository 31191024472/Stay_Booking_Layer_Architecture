import Checkbox from 'components/ux/checkbox/Checkbox';

/**
 * Thành phần VerticalFilters
 * Hiển thị giao diện bộ lọc dọc để lọc kết quả khách sạn.
 *
 * @param {Object} props - Thuộc tính của component.
 * @param {Array} props.filtersData - Mảng chứa dữ liệu các bộ lọc cần hiển thị.
 * @param {Function} props.onFiltersUpdate - Hàm callback xử lý khi bộ lọc được cập nhật.
 * @param {Function} props.onClearFiltersAction - Hàm callback xử lý khi xóa tất cả bộ lọc.
 * @param {boolean} props.isVerticalFiltersOpen - Cờ kiểm soát hiển thị bộ lọc dọc.
 */

const VerticalFilters = (props) => {
  const {
    filtersData,
    onFiltersUpdate,
    onClearFiltersAction,
    isVerticalFiltersOpen,
  } = props;
// Kiểm tra xem có bộ lọc nào đang được chọn không
  const isActiveFilterSelected = () => {
    for (const filterGroup of filtersData) {
      for (const subfilter of filterGroup.filters) {
        if (subfilter.isSelected) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div
      className={`hotels-filters__container shadow-lg border w-[240px] z-10 ${
        isVerticalFiltersOpen ? '' : 'hidden'
      } absolute top-10 left-2 bg-white md:block md:static md:shadow-none `}
      data-testid="vertical-filters"
    >
      <div className="hotels-filters__header flex justify-between items-center py-2 border-b-2  px-4">
        <h4 className="text-base font-bold text-slate-600 uppercase">
          Bộ lọc 
        </h4>
        <button
          className={`text-sm inline-flex items-center px-2.5 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white ${
            isActiveFilterSelected() === true
              ? 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              : 'cursor-not-allowed'
          }`}
          onClick={onClearFiltersAction}
        >
          Xoá
        </button>
      </div>
      {filtersData.map((filter) => (
        <div className="border-b-2" key={filter.filterId}>
          <h4 className="text-base font-bold text-slate-600 my-1 px-2">
            {filter.title}
          </h4>
          {filter.filters.map((subfilter) => (
            <Checkbox
              key={subfilter.id}
              id={subfilter.id}
              label={subfilter.title}
              isSelected={subfilter.isSelected}
              filterId={filter.filterId}
              onFiltersUpdate={onFiltersUpdate}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default VerticalFilters;