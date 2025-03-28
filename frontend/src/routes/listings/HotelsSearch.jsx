import React, { useState, useEffect, useCallback } from 'react';
import GlobalSearchBox from 'components/global-search-box/GlobalSearchbox';
import ResultsContainer from 'components/results-container/ResultsContainer';
import { networkAdapter } from 'services/NetworkAdapter';
import isEmpty from 'utils/helpers';
import { MAX_GUESTS_INPUT_VALUE } from 'utils/constants';
import { formatDate } from 'utils/date-helpers';
import { useLocation, useSearchParams } from 'react-router-dom';
import { parse } from 'date-fns';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import { SORTING_FILTER_LABELS } from 'utils/constants';
import _debounce from 'lodash/debounce';

/**
 * Thành phần tìm kiếm khách sạn.
 * @component
 * @returns {JSX.Element} Thành phần tìm kiếm khách sạn.
 */

const HotelsSearch = () => {
  // Trạng thái quản lý hiển thị bộ chọn ngày
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);

  // Trạng thái lưu giá trị nhập vị trí
  const [locationInputValue, setLocationInputValue] = useState('Hồ Chí Minh');

  // Trạng thái lưu số lượng khách nhập vào
  const [numGuestsInputValue, setNumGuestsInputValue] = useState('');

  // Trạng thái lưu danh sách thành phố có sẵn
  const [availableCities, setAvailableCities] = useState([]);

  /// Trạng thái lưu trang kết quả hiện tại
  const [currentResultsPage, setCurrentResultsPage] = useState(1);

  // Trạng thái lưu thông tin bộ lọc
  const [filtersData, setFiltersData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // Trạng thái lưu bộ lọc sắp xếp
  const [hotelsResults, setHotelsResults] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);

  // Trạng thái lưu bộ lọc sắp xếp
  const [sortByFilterValue, setSortByFilterValue] = useState({
    value: 'default',
    label: 'Lọc theo',
  });

  // Trạng thái lưu bộ lọc đã chọn
  const [selectedFiltersState, setSelectedFiltersState] = useState({});

  const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);

  // Hàm debounce để tối ưu hóa truy vấn tìm kiếm
  const debounceFn = useCallback(_debounce(queryResults, 1000), []);

  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();

   // Tùy chọn bộ lọc sắp xếp
  const sortingFilterOptions = [
    { value: 'default', label: 'Lọc theo' },
    { value: 'priceLowToHigh', label: SORTING_FILTER_LABELS.PRICE_LOW_TO_HIGH },
    { value: 'priceHighToLow', label: SORTING_FILTER_LABELS.PRICE_HIGH_TO_LOW },
  ];

  /**
   * Cập nhật bộ lọc sắp xếp.
   * @param {Object} selectedOption - Tùy chọn được chọn.
   */
  const onSortingFilterChange = (selectedOption) => {
    setSortByFilterValue(selectedOption);
  };


 /**
   * Cập nhật bộ lọc đã chọn.
   * @param {Object} updatedFilter - Bộ lọc được cập nhật.
   */

  const onFiltersUpdate = (updatedFilter) => {
    setSelectedFiltersState(
      selectedFiltersState.map((filterGroup) => {
        if (filterGroup.filterId === updatedFilter.filterId) {
          return {
            ...filterGroup,
            filters: filterGroup.filters.map((filter) => {
              if (filter.id === updatedFilter.id) {
                return {
                  ...filter,
                  isSelected: !filter.isSelected,
                };
              }
              return filter;
            }),
          };
        }
        return filterGroup;
      })
    );
  };

  const onDateChangeHandler = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const onSearchButtonAction = () => {
    const activeFilters = getActiveFilters();
    const numGuest = Number(numGuestsInputValue);
    const checkInDate = formatDate(dateRange.startDate) ?? '';
    const checkOutDate = formatDate(dateRange.endDate) ?? '';
    setSearchParams({
      city: locationInputValue,
      numGuests: numGuestsInputValue,
    });
    fetchHotels({
      city: locationInputValue,
      ...activeFilters,
      guests: numGuest,
      checkInDate,
      checkOutDate,
    });
  };

  const getActiveFilters = () => {
    const filters = {};
    selectedFiltersState.forEach((category) => {
      const selectedValues = category.filters
        .filter((filter) => filter.isSelected)
        .map((filter) => filter.value);

      if (selectedValues.length > 0) {
        filters[category.filterId] = selectedValues;
      }
    });
    if (!isEmpty(filters)) {
      return filters;
    }
    return null;
  };

  // Chuyển đổi trạng thái hiển thị của bộ chọn ngày
  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  /**
   * Xử lý thay đổi trong ô nhập địa điểm.
   * Làm mới dữ liệu khách sạn nếu địa điểm hợp lệ.
   * @param {string} value - Giá trị địa điểm mới.
   */
  const onLocationChangeInput = async (newValue) => {
    setLocationInputValue(newValue);
    
    debounceFn(newValue, availableCities);
  };

  /**
   * Truy vấn danh sách thành phố có sẵn dựa trên đầu vào của người dùng
   * @param {string} query - Đầu vào người dùng.
   * @returns {void}
   *
   */
  
  function queryResults(query, availableCities) {
    const filteredResults = availableCities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    setFilteredTypeheadResults(filteredResults);
  }

  /**
   * Xử lý thay đổi trong ô nhập số lượng khách.
   * @param {String} numGuests - Số lượng khách mới.
   */
  const onNumGuestsInputChange = (numGuests) => {
    if (numGuests < MAX_GUESTS_INPUT_VALUE && numGuests > 0) {
      setNumGuestsInputValue(numGuests);
    }
  };

  const onClearFiltersAction = () => {
    const hasActiveFilters = selectedFiltersState.some((filterGroup) =>
      filterGroup.filters.some((filter) => filter.isSelected)
    );

    if (hasActiveFilters) {
      setSelectedFiltersState(
        selectedFiltersState.map((filterGroup) => ({
          ...filterGroup,
          filters: filterGroup.filters.map((filter) => ({
            ...filter,
            isSelected: false,
          })),
        }))
      );
    }
  };

  /**
   * Lấy danh sách khách sạn dựa trên các bộ lọc đã cung cấp..
   * @param {Object} filters - Các bộ lọc được áp dụng.
   * @returns {Promise<void>}
   * @async
   */
  const fetchHotels = async (filters) => {
    setHotelsResults({
      isLoading: true,
      data: [],
      errors: [],
    });
    const hotelsResultsResponse = await networkAdapter.get('/api/hotels', {
      filters: JSON.stringify(filters),
      currentPage: currentResultsPage,
      advancedFilters: JSON.stringify([
        {
          sortBy: sortByFilterValue.value,
        },
      ]),
    });
    if (hotelsResultsResponse) {
      setHotelsResults({
        isLoading: false,
        data: hotelsResultsResponse.data.elements,
        errors: hotelsResultsResponse.errors,
        metadata: hotelsResultsResponse.metadata,
        pagination: hotelsResultsResponse.paging,
      });
    }
  };

  const getVerticalFiltersData = async () => {
    const filtersDataResponse = await networkAdapter.get(
      'api/hotels/verticalFilters'
    );
    if (filtersDataResponse) {
      setFiltersData({
        isLoading: false,
        data: filtersDataResponse.data.elements,
        errors: filtersDataResponse.errors,
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentResultsPage(page);
  };

  const handlePreviousPageChange = () => {
    setCurrentResultsPage((prev) => {
      if (prev <= 1) return prev;
      return prev - 1;
    });
  };

  const handleNextPageChange = () => {
    setCurrentResultsPage((prev) => {
      if (prev >= hotelsResults.pagination.totalPages) return prev;
      return prev + 1;
    });
  };

  // Lấy danh sách thành phố có sẵn
  const fetchAvailableCities = async () => {
    const availableCitiesResponse = await networkAdapter.get(
      '/api/availableCities'
    );
    if (availableCitiesResponse) {
      setAvailableCities(availableCitiesResponse.data.elements);
    }
  };

  // Lấy danh sách thành phố có sẵn khi trang được tải
  useEffect(() => {
    fetchAvailableCities();
    getVerticalFiltersData();
  }, []);

  // Lấy danh sách khách sạn khi trang được tải
  useEffect(() => {
    if (searchParams.get('city')) {
      setLocationInputValue(searchParams.get('city'));
    }

    if (searchParams.get('numGuests')) {
      setNumGuestsInputValue(searchParams.get('numGuests'));
    }
  }, [searchParams]);

  // Cập nhật bộ lọc đã chọn khi dữ liệu bộ lọc thay đổi
  useEffect(() => {
    setSelectedFiltersState(
      filtersData.data.map((filterGroup) => ({
        ...filterGroup,
        filters: filterGroup.filters.map((filter) => ({
          ...filter,
          isSelected: false,
        })),
      }))
    );
  }, [filtersData]);

  useEffect(() => {
    if (selectedFiltersState.length > 0) {
      const activeFilters = getActiveFilters();
      if (activeFilters) {
        activeFilters.city = locationInputValue.toLowerCase();
        fetchHotels(activeFilters);
      } else {
        fetchHotels({
          city: locationInputValue,
        });
      }
    }
   
  }, [selectedFiltersState, currentResultsPage, sortByFilterValue]);

  // Cập nhật trạng thái nhập liệu từ location.state
  useEffect(() => {
    if (location.state) {
      const { city, numGuest, checkInDate, checkOutDate } = location.state;
      if (numGuest) {
        setNumGuestsInputValue(numGuest.toString());
      }
      setLocationInputValue(city);
      if (checkInDate && checkOutDate) {
        setDateRange([
          {
            startDate: parse(checkInDate, 'dd/MM/yyyy', new Date()),
            endDate: parse(checkOutDate, 'dd/MM/yyyy', new Date()),
            key: 'selection',
          },
        ]);
      }
    }
  }, [location]);

  return (
    <div className="hotels">
      <div className="bg-brand px-2 lg:h-[120px] h-[220px] flex items-center justify-center">
        <GlobalSearchBox
          locationInputValue={locationInputValue}
          locationTypeheadResults={filteredTypeheadResults}
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
      <div className="my-4"></div>
      <div className="w-[180px]"></div>
      <ResultsContainer
        hotelsResults={hotelsResults}
        enableFilters={true}
        filtersData={filtersData}
        onFiltersUpdate={onFiltersUpdate}
        onClearFiltersAction={onClearFiltersAction}
        selectedFiltersState={selectedFiltersState}
        sortByFilterValue={sortByFilterValue}
        onSortingFilterChange={onSortingFilterChange}
        sortingFilterOptions={sortingFilterOptions}
      />
      {hotelsResults.pagination?.totalPages > 1 && (
        <div className="my-4">
          <PaginationController
            currentPage={currentResultsPage}
            totalPages={hotelsResults.pagination?.totalPages}
            handlePageChange={handlePageChange}
            handlePreviousPageChange={handlePreviousPageChange}
            handleNextPageChange={handleNextPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default HotelsSearch;