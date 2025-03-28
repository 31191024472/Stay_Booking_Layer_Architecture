import { createServer, Model, Response } from 'miragejs';
import hotelsData from './data/hotels.json';
import countriesData from './data/countries.json';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      // 
    },

    seeds(server) {
      server.create('user', {
        id: '1',
        email: 'anhphan@example.com',
        password: 'password1',
        firstName: 'Ngoc Anh',
        lastName: 'Phan',
        fullName: 'Phan Ngoc Anh',
        phone: '1234567890',
        country: 'VietNam',
        isPhoneVerified: true,
        isEmailVerified: true,
      });
      server.create('user', {
        id: '2',
        email: 'phongng@example.com',
        password: 'password2',
        firstName: 'Nhut Phong',
        lastName: 'Nguyen',
        fullName: 'Nguyen Nhut Phong',
        phone: '0987654321',
        country: 'VietNam',
        isPhoneVerified: false,
        isEmailVerified: true,
      });
    },

    routes() {
      this.namespace = 'api';

       // Thêm trạng thái người dùng đã đăng nhập vào máy chủ
      let loggedInUser = null;

      this.passthrough('http://localhost:4000/*');

      this.get('/users/auth-user', () => {
        if (loggedInUser) {
          return new Response(
            200,
            {},
            {
              errors: [],
              data: {
                isAuthenticated: true,
                userDetails: {
                  id: loggedInUser.id,
                  firstName: loggedInUser.firstName,
                  lastName: loggedInUser.lastName,
                  fullName: loggedInUser.fullName,
                  email: loggedInUser.email,
                  phone: loggedInUser.phone,
                  country: loggedInUser.country,
                  isPhoneVerified: loggedInUser.isPhoneVerified,
                  isEmailVerified: loggedInUser.isEmailVerified,
                },
              },
            }
          );
        } else {
          return new Response(
            200,
            {},
            {
              errors: [],
              data: {
                isAuthenticated: false,
                userDetails: {},
              },
            }
          );
        }
      });

      this.post('/users/login', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email: attrs.email });

        if (user && user.password === attrs.password) {
          loggedInUser = user;
          return new Response(
            200,
            {},
            {
              data: {
                token:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBKb2huIiwiaWQiOjEsImlhdCI6MTcwNzU0NTQ5MSwiZXhwIjoxNzA3NTQ5MDkxfQ.dxweIMZGiCuiViov1EfLtu3UwanUMp7TjL85hMDW4rc',
              },
              errors: [],
            }
          );
        } else {
          return new Response(
            404,
            {},
            {
              errors: ['Người dùng không tồn tại hoặc thông tin đăng nhập không hợp lệ'],
              data: {},
            }
          );
        }
      });

      this.post('/users/logout', (_schema, _request) => {
        loggedInUser = null;
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              status: 'Người dùng đã đăng xuất thành công ',
            },
          }
        );
      });

      this.put('/users/register', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const existingUser = schema.users.findBy({ email: attrs.email });

        if (existingUser) {
          return new Response(
            409,
            {},
            { errors: ['Email đã được sử dụng'] }
          );
        } else {
          // Đăng ký người dùng mới
          const newUser = schema.users.create({
            firstName: attrs.firstName,
            lastName: attrs.lastName,
            email: attrs.email,
            phone: attrs.phone,
            password: attrs.password,
          });
          return new Response(
            200,
            {},
            {
              errors: [],
              user: newUser.attrs,
            }
          );
        }
      });

      // Cập nhật hồ sơ người dùng
      this.patch('/users/update-profile', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email: loggedInUser.email });

        if (user) {
          user.update(attrs);
          return new Response(
            200,
            {},
            {
              errors: [],
              data: {
                status: 'Cập nhật hồ sơ thành công',
              },
            }
          );
        } else {
          return new Response(
            404,
            {},
            {
              errors: ['Không tìm thấy người dùng'],
              data: {},
            }
          );
        }
      });

      // Lấy danh sách đặt phòng của người dùng
      this.get('/users/bookings', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  bookingId: 'BKG123',
                  bookingDate: '2024-01-10',
                  hotelName: 'Awaken Da Nang Hotel',
                  checkInDate: '2024-01-20',
                  checkOutDate: '2024-01-25',
                  totalFare: '2500000 VND',
                },
                {
                  bookingId: 'BKG124',
                  bookingDate: '2024-01-03',
                  hotelName: 'JW Marriott Hotel Ha Noi ',
                  checkInDate: '2024-02-15',
                  checkOutDate: '2024-02-20',
                  totalFare: '7900000 VND',
                },
                {
                  bookingId: 'BKG125',
                  bookingDate: '2024-01-11',
                  hotelName: 'Hilton Da Nang',
                  checkInDate: '2024-03-01',
                  checkOutDate: '2024-03-05',
                  totalFare: '2100000 VND',
                },
              ],
            },
          }
        );
      });

      this.get('/users/payment-methods', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  id: '1',
                  cardType: 'Visa',
                  cardNumber: '**** **** **** 1234',
                  expiryDate: '08/26',
                },
                {
                  id: '2',
                  cardType: 'MasterCard',
                  cardNumber: '**** **** **** 5678',
                  expiryDate: '07/24',
                },
                {
                  id: '3',
                  cardType: 'American Express',
                  cardNumber: '**** **** **** 9012',
                  expiryDate: '05/25',
                },
              ],
            },
          }
        );
      });

      this.get('/hotel/:hotelId/booking/enquiry', (_schema, request) => {
        let hotelId = request.params.hotelId;
        const result = hotelsData.find((hotel) => {
          return Number(hotel.hotelCode) === Number(hotelId);
        });
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              name: result.title,
              cancellationPolicy: 'Hủy miễn phí 1 ngày trước khi lưu trú',
              checkInTime: '12:00 PM',
              checkOutTime: '10:00 AM',
              currentNightRate: result.price,
              maxGuestsAllowed: 5,
              maxRoomsAllowedPerGuest: 3,
            },
          }
        );
      });

      this.get('/popularDestinations', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  code: 1211,
                  name: 'Cần Thơ',
                  imageUrl: '/images/cities/cantho.jpg',
                },
                {
                  code: 1212,
                  name: 'Hồ Chí Minh',
                  imageUrl: '/images/cities/hcm.jpg',
                },
                {
                  code: 1213,
                  name: 'Hà Nội',
                  imageUrl: '/images/cities/hanoi.jpg',
                },
                {
                  code: 1214,
                  name: 'Đà Nẵng',
                  imageUrl: '/images/cities/danang.jpg',
                },
                {
                  code: 1215,
                  name: 'Đà Lạt',
                  imageUrl: '/images/cities/dalat.jpg',
                },
              ],
            },
          }
        );
      });

      this.get('/nearbyHotels', () => {
        const hotels = hotelsData.filter((hotel) => {
          return hotel.city === 'Hồ Chí Minh';
        });
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: hotels,
            },
          }
        );
      });

      this.get('/hotel/:hotelId', (_schema, request) => {
        let hotelId = request.params.hotelId;
        const description = [
            'Một kỳ nghỉ thanh bình đang chờ đón bạn tại khách sạn sang trọng của chúng tôi, nơi kết hợp giữa sự sang trọng và thoải mái với các tiện nghi hàng đầu.',
            'Trải nghiệm đỉnh cao của sự thanh lịch trong các phòng được thiết kế đẹp mắt của chúng tôi với tầm nhìn tuyệt đẹp ra quang cảnh thành phố.',
            'Thưởng thức những món ăn ngon tại các nhà hàng trong khuôn viên của chúng tôi, với các món ăn địa phương và quốc tế.',
            'Thư giãn tại spa và trung tâm chăm sóc sức khỏe hiện đại của chúng tôi, nơi nghỉ ngơi hoàn hảo cho các giác quan.',
            'Nằm ở trung tâm thành phố, khách sạn của chúng tôi là nơi lý tưởng cho cả du khách giải trí và công tác.',
        ];

        const result = hotelsData.find((hotel) => {
          return Number(hotel.hotelCode) === Number(hotelId);
        });

        result.description = description;

        return new Response(
          200,
          {},
          {
            errors: [],
            data: result,
          }
        );
      });

      this.get('/hotel/:hotelId/reviews', (_schema, request) => {
        // 
        const currentPage = request.queryParams.currentPage;
        let hotelId = 71222;
        const result = hotelsData.find((hotel) => {
          return Number(hotel.hotelCode) === Number(hotelId);
        });
        const totalRatings = result.reviews.data.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const initialCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const starCounts = result.reviews.data.reduce((acc, review) => {
          const ratingKey = Math.floor(review.rating).toString();
          if (acc.hasOwnProperty(ratingKey)) {
            acc[ratingKey]++;
          }
          return acc;
        }, initialCounts);

        const metadata = {
          totalReviews: result.reviews.data.length,
          averageRating: (totalRatings / result.reviews.data.length).toFixed(1),
          starCounts,
        };

        //paging
        const pageSize = 5;
        const paging = {
          currentPage: currentPage || 1,
          totalPages:
            Math.floor((result.reviews.data.length - 1) / pageSize) + 1,
          pageSize,
        };

        // paginated data
        const data = result.reviews.data.slice(
          (paging.currentPage - 1) * pageSize,
          paging.currentPage * pageSize
        );

        return {
          errors: [],
          data: {
            elements: data,
          },
          metadata,
          paging,
        };
      });

      this.put('/hotel/add-review', (schema, request) => {
        // const attrs = JSON.parse(request.requestBody);
        // const hotelId = attrs.hotelId;
        // const review = attrs.review;
        // const rating = attrs.rating;
        // const user = schema.users.findBy({ email: attrs.email });
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              status: 'Thêm bình luận thành công',
            },
          }
        );
      });

      this.get('/hotels', (_schema, request) => {
        let currentPage = request.queryParams.currentPage;
        const filters = request.queryParams.filters;
        const parsedFilters = JSON.parse(filters);
        const parsedAdvancedFilters = JSON.parse(
          request.queryParams.advancedFilters
        );
        const city = parsedFilters.city;
        const star_ratings = parsedFilters.star_ratings;
        const priceFilter = parsedFilters.priceFilter;
        const sortByFilter = parsedAdvancedFilters.find((filter) => {
          return filter.sortBy;
        });

        const filteredResults = hotelsData.filter((hotel) => {
          const hotelRating = parseFloat(hotel.ratings);
          const hotelPrice = parseFloat(hotel.price.replace(',', ''));
          const isCityMatch = city === '' || hotel.city === city;
          const isPriceMatch =
            !priceFilter ||
            (hotelPrice >= parseFloat(priceFilter.start) &&
              hotelPrice <= parseFloat(priceFilter.end));

          if (isCityMatch && isPriceMatch) {
            if (star_ratings && star_ratings.length > 0) {
              return star_ratings.some((selectedRating) => {
                const selected = parseFloat(selectedRating);
                const range = 0.5;
                return Math.abs(hotelRating - selected) <= range;
              });
            } else {
              // If no star ratings are provided, return all hotels for the city (or all cities if city is empty)
              return true;
            }
          }
          return false;
        });

        if (sortByFilter) {
          const sortType = sortByFilter.sortBy;
          if (sortType === 'priceLowToHigh') {
            filteredResults.sort((a, b) => {
              return a.price - b.price;
            });
          }
          if (sortType === 'priceHighToLow') {
            filteredResults.sort((a, b) => {
              return b.price - a.price;
            });
          }
        }

        // pagination config
        const pageSize = 6;
        const totalPages =
          Math.floor((filteredResults.length - 1) / pageSize) + 1;
        currentPage = currentPage > totalPages ? totalPages : currentPage;
        const paging = {
          currentPage: currentPage || 1,
          totalPages: Math.floor((filteredResults.length - 1) / pageSize) + 1,
          pageSize,
        };

        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: filteredResults.slice(
                (paging.currentPage - 1) * pageSize,
                paging.currentPage * pageSize
              ),
            },
            metadata: {
              totalResults: filteredResults.length,
            },
            paging,
          }
        );
      });

      this.get('/availableCities', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'],
            },
          }
        );
      });

      this.get('/hotels/verticalFilters', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  filterId: 'star_ratings',
                  title: 'Xếp hạng',
                  filters: [
                    {
                      id: '5_star_rating',
                      title: '5 Sao',
                      value: '5',
                    },
                    {
                      id: '4_star_rating',
                      title: '4 Sao',
                      value: '4',
                    },
                    {
                      id: '3_star_rating',
                      title: '3 Sao',
                      value: '3',
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
            },
          }
        );
      });

      this.post('/payments/confirmation', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              new Response(
                200,
                {},
                {
                  errors: [],
                  data: {
                    status: 'Thanh toán thành công',
                    bookingDetails: [
                      {
                        label: 'Mã đặt phòng',
                        value: 'BKG123',
                      },
                      {
                        label: 'Ngày đặt phòng',
                        value: '2024-01-10',
                      },
                      {
                        label: 'Khách sạn',
                        value: 'Awaken Da Nang Hotel',
                      },
                      {
                        label: 'Ngày nhận phòng',
                        value: '2024-01-20',
                      },
                      {
                        label: 'Ngày trả phòng',
                        value: '2024-01-25',
                      },
                      {
                        label: 'Tổng cộng',
                        value: '2.500.000 VND',
                      },
                    ],
                  },
                }
              )
            );
          }, 6000); // 2000 milliseconds = 2 seconds
        });
      });

      this.get('/misc/countries', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: countriesData,
            },
          }
        );
      });
    },
  });

  return server;
}