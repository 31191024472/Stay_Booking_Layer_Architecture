/// <reference types="cypress" />
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ResultsContainer from './ResultsContainer';

describe('ResultsContainer', () => {
  const mockFiltersData = {
    isLoading: false,
    data: [
      {
        filterId: 'star_ratings',
        title: 'Xếp hạng sao',
        filters: [
          {
            id: '5_star_rating',
            title: '5 Sao',
          },
          {
            id: '4_star_rating',
            title: '4 Sao',
          },
          {
            id: '3_star_rating',
            title: '3 Sao',
          },
        ],
      },
      {
        filterId: 'propety_type',
        title: 'Loại chỗ ở',
        filters: [
          {
            id: 'prop_type_hotel',
            title: 'Khách sạn',
          },
          {
            id: 'prop_type_apartment',
            title: 'Căn hộ',
          },
          {
            id: 'prop_type_villa',
            title: 'Biệt thự',
          },
        ],
      },
    ],
  };
  // Dữ liệu giả lập cho danh sách khách sạn
  const mockHotelsResults = {
    isLoading: false,
    data: [
      {
        hotelCode: 71222,
        images: [
          {
            imageUrl: '/images/hotels/JW Marriott Hotel Hanoi/505916043.jpg',
            accessibleText: 'JW Marriott Hotel Hanoi',
          },
          {
            imageUrl: '/images/hotels/JW Marriott Hotel Hanoi/540603347.jpg',
            accessibleText: 'JW Marriott Hotel Hanoi',
          },
          {
            imageUrl: '/images/hotels/JW Marriott Hotel Hanoi/540603391.jpg',
            accessibleText: 'JW Marriott Hotel Hanoi',
          },
          {
            imageUrl: '/images/hotels/JW Marriott Hotel Hanoi/540603393.jpg',
            accessibleText: 'JW Marriott Hotel Hanoi',
          },
          {
            imageUrl: '/images/hotels/JW Marriott Hotel Hanoi/540603394.jpg',
            accessibleText: 'JW Marriott Hotel Hanoi',
          },
        ],
        title: 'JW Marriott Hotel Hanoi',
        subtitle: 'Hoàn Kiếm, Hà Nội | 0.5 km từ trung tâm thành phố',
        benefits: [
          "Hủy phòng miễn phí",
          "Không cần thanh toán trước – thanh toán tại khách sạn",
          "Wifi miễn phí"
        ],
        price: '6500000',
        ratings: '5',
        city: 'Hà Nội',
        reviews: {
          data: [
            {
              reviewerName: 'Nguyễn Hoàng Nam',
              rating: 5,
              review: 'Khách sạn rất tuyệt vời và nhân viên rất thân thiện. Thức ăn cũng rất ngon.',
              date: 'Ngày ở: 01-01-2021'
            },
            {
              reviewerName: 'Trần Ngọc Hà',
              rating: 4,
              review: 'Khách sạn tuyệt vời với dịch vụ xuất sắc. Các phòng rộng rãi và sạch sẽ. Nhân viên đã làm rất tốt để đảm bảo một kỳ nghỉ thoải mái. Rất đáng khuyên!',
              date: 'Ngày ở: 15-02-2021',
            },
            {
              reviewerName: 'Trần Văn Hùng',
              rating: 3,
              review: 'Khách sạn dễ thương với vị trí tuyệt vời. Nhân viên thân thiện và hữu ích.',
              date: 'Date of stay: 2021-03-10',
            },
            {
              reviewerName: 'Nguyễn Mỹ Linh',
              rating: 5,
              review: 'Tôi rất thích kỳ nghỉ tại khách sạn. Phòng rất thoải mái và nhân viên thân thiện.',
              date: 'Date of stay: 2021-04-20',
            },
            {
              reviewerName: 'Quốc Tuấn',
              rating: 1,
              review:
                'Trải nghiệm tồi tệ. Khách sạn bẩn và nhân viên thô lỗ',
              date: 'Date of stay: 2021-05-05',
            },
            
            {
              reviewerName: 'Ethan Davis',
              rating: 4,
              review:
                'Fantastic hotel with great amenities. The staff was attentive and helpful.',
              date: 'Date of stay: 2021-11-20',
            },
          ],
        },
      },
      {
        hotelCode: 71223,
        images: [
          {
            imageUrl: '/images/hotels/Melia Ba Vi Mountain Retreat/136294750.jpg',
            accessibleText: 'Melia Ba Vi Mountain Retreat',
          },
        ],
        title: 'Melia Ba Vi Mountain Retreat',
        subtitle: ' Hà Nội | 23 km từ trung tâm thành phố',
        benefits: [
            "Hủy phòng miễn phí",
            "Wifi miễn phí",
            "Hồ bơi ngoài trời"
        ],
        price: '2500000',
        ratings: '4',
         
      },
      {
        hotelCode: 71224,
        images: [
          {
            imageUrl: '/images/hotels/JW Marriott Hotel and Suites Saigon/655143230.jpg',
            accessibleText: 'JW Marriott Hotel and Suites Saigon',
          },
        ],
        title: 'JW Marriott Hotel and Suites Saigon',
        subtitle: 'TP. Hồ Chí Minh | 2.5 km từ trung tâm thành phố',
        benefits: [
          "Hủy phòng miễn phí",
          "Không cần thanh toán trước – thanh toán tại khách sạn",
          "Wifi miễn phí",
          "Bữa sáng miễn phí"
        ],
        price: '7000000',
        ratings: '5',
        city: 'Hồ Chí Minh',
      },
      {
        hotelCode: 71225,
        images: [
          {
            imageUrl: '/images/hotels/PARKROYAL Saigon/133800871.jpg',
            accessibleText: 'PARKROYAL Saigon',
          },
        ],
        title: 'PARKROYAL Saigon',
        subtitle: 'Quận 1, TP. Hồ Chí Minh | 0.3 km từ trung tâm thành phố',
        benefits: [
          "Hồ bơi ngoài trời",
          "Wifi miễn phí",
          "Trà/cà phê trong phòng",
          "Dịch vụ đưa đón sân bay"
        ],
        price: '5200000',
        ratings: '3',
        city: 'Hồ Chí Minh',
      },
      {
        hotelCode: 81223,
        images: [
          {
            imageUrl: '/images/hotels//Awaken Da Nang Hotel/605065945.jpg',
            accessibleText: 'Awaken Da Nang Hotel',
          },
        ],
        title: 'Awaken Da Nang Hotel',
        subtitle: 'Sơn Trà, Đà Nẵng | 12 km từ trung tâm thành phố',
        benefits: [
          "Bãi biển riêng",
          "Wifi miễn phí",
          "Hủy phòng miễn phí",
          "Spa và trung tâm chăm sóc sức khỏe"
        ],
        price: '4800000',
        ratings: '4.3',
        city: 'Đà Nẵng',
      },
    ],
  };

  const selectedFiltersState = mockFiltersData.data.map((filterGroup) => ({
    ...filterGroup,
    filters: filterGroup.filters.map((filter) => ({
      ...filter,
      isSelected: false,
    })),
  }));

  beforeEach(() => {
    // cy.intercept() to mock API responses
  });

  it('renders hotel view cards when not loading', () => {
    cy.mount(
      <BrowserRouter>
        <ResultsContainer
          hotelsResults={mockHotelsResults}
          enableFilters={false}
          filtersData={mockFiltersData}
        />
      </BrowserRouter>
    );

    cy.get('[data-testid=hotel-view-card]').should('have.length', 5);
  });

  it('renders hotel view card skeletons when loading', () => {
    cy.mount(
      <BrowserRouter>
        <ResultsContainer
          hotelsResults={{ ...mockHotelsResults, isLoading: true }}
          enableFilters={false}
          filtersData={mockFiltersData}
        />
      </BrowserRouter>
    );
    cy.get('[data-testid=hotel-view-card-skeleton]').should('have.length', 5);
  });

  it('renders vertical filters when filters are enabled and not loading', () => {
    cy.mount(
      <BrowserRouter>
        <ResultsContainer
          hotelsResults={mockHotelsResults}
          enableFilters={true}
          filtersData={{ ...mockFiltersData, isLoading: false }}
          selectedFiltersState={selectedFiltersState}
          onFiltersUpdate={() => {}}
        />
      </BrowserRouter>
    );
    cy.get('[data-testid=vertical-filters]').should('exist');
  });

  it('renders vertical filters skeleton when filters are enabled and loading', () => {
    cy.mount(
      <BrowserRouter>
        <ResultsContainer
          hotelsResults={mockHotelsResults}
          enableFilters={true}
          filtersData={{ ...mockFiltersData, isLoading: true }}
          selectedFiltersState={[]}
          onFiltersUpdate={() => {}}
        />
      </BrowserRouter>
    );
    cy.get('[data-testid=vertical-filters-skeleton]').should('exist');
  });

  it('calls onFiltersUpdate with correct arguments', () => {
    const onFiltersUpdateSpy = cy.spy().as('onFiltersUpdateSpy');

    cy.mount(
      <BrowserRouter>
        <ResultsContainer
          hotelsResults={mockHotelsResults}
          enableFilters={true}
          filtersData={mockFiltersData}
          onFiltersUpdate={onFiltersUpdateSpy}
          selectedFiltersState={selectedFiltersState}
        />
      </BrowserRouter>
    );

    cy.get('[data-testid=vertical-filters__toggle-menu]').click();

    cy.get('[data-testid=5_star_rating]').click();

    cy.get('@onFiltersUpdateSpy').should('have.been.calledWith', {
      filterId: 'star_ratings',
      id: '5_star_rating',
    });

    cy.get('[data-testid=4_star_rating]').click();

    cy.get('@onFiltersUpdateSpy').should('have.been.calledWith', {
      filterId: 'star_ratings',
      id: '4_star_rating',
    });
  });
});