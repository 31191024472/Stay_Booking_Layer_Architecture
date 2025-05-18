import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  // Dữ liệu mẫu cho đặt phòng
  const defaultBookings = [
    {
      _id: '1',
      roomId: '1',
      userId: '1',
      checkIn: '2024-03-20',
      checkOut: '2024-03-22',
      totalPrice: 3000000,
      status: 'pending',
      guestInfo: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789'
      },
      paymentStatus: 'pending',
      createdAt: '2024-03-15T10:00:00Z'
    },
    {
      _id: '2',
      roomId: '2',
      userId: '2',
      checkIn: '2024-03-25',
      checkOut: '2024-03-27',
      totalPrice: 5000000,
      status: 'confirmed',
      guestInfo: {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321'
      },
      paymentStatus: 'paid',
      createdAt: '2024-03-16T15:30:00Z'
    }
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchBookings(selectedHotel);
    }
  }, [selectedHotel, filter]);

  const fetchHotels = async () => {
    try {
      const response = await networkAdapter.get('api/partner/hotels');
      if (response.success) {
        setHotels(response.data);
        if (response.data.length > 0) {
          setSelectedHotel(response.data[0]._id);
        }
      }
    } catch (err) {
      setError('Không thể tải danh sách khách sạn');
    }
  };

  const fetchBookings = async (hotelId) => {
    setLoading(true);
    try {
      const response = await networkAdapter.get(`api/partner/hotels/${hotelId}/bookings?status=${filter}`);
      if (response.success) {
        setBookings(response.data);
      } else {
        setError('Không thể tải danh sách đặt phòng');
        setBookings(defaultBookings);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      setBookings(defaultBookings);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await networkAdapter.put(`api/partner/bookings/${bookingId}/status`, {
        status: newStatus
      });
      if (response.success) {
        fetchBookings(selectedHotel);
      } else {
        setError(response.message || 'Không thể cập nhật trạng thái');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const renderBookingCard = (booking) => (
    <div key={booking._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Đặt phòng #{booking._id.slice(-6)}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(booking.createdAt)}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status === 'confirmed' ? 'Đã xác nhận' :
             booking.status === 'pending' ? 'Chờ xác nhận' :
             'Đã hủy'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-medium">Khách hàng:</span> {booking.guestInfo.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">Email:</span> {booking.guestInfo.email}
          </p>
          <p className="text-sm">
            <span className="font-medium">SĐT:</span> {booking.guestInfo.phone}
          </p>
          <p className="text-sm">
            <span className="font-medium">Check-in:</span> {formatDate(booking.checkIn)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Check-out:</span> {formatDate(booking.checkOut)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Tổng tiền:</span> {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
          </p>
          <p className="text-sm">
            <span className="font-medium">Thanh toán:</span>
            <span className={`ml-2 ${
              booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </span>
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedBooking(booking);
              setShowDetailModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            title="Xem chi tiết"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          {booking.status === 'pending' && (
            <div className="space-x-2">
              <button
                onClick={() => handleStatusChange(booking._id, 'confirmed')}
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
                title="Xác nhận"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                onClick={() => handleStatusChange(booking._id, 'cancelled')}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                title="Hủy"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý đặt phòng</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đặt phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.bookingCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.roomName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(booking.checkIn).toLocaleDateString('vi-VN')} - {new Date(booking.checkOut).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.totalAmount.toLocaleString('vi-VN')} VNĐ</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Đã xác nhận' :
                     booking.status === 'pending' ? 'Chờ xác nhận' :
                     'Đã hủy'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  <button className="text-brand hover:text-blue-600 ml-3">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết đặt phòng */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chi tiết đặt phòng</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Mã đặt phòng</p>
                  <p className="text-sm text-gray-600">#{selectedBooking._id.slice(-6)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Ngày đặt</p>
                  <p className="text-sm text-gray-600">{formatDate(selectedBooking.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                  <p className={`text-sm ${
                    selectedBooking.status === 'confirmed' ? 'text-green-600' :
                    selectedBooking.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {selectedBooking.status === 'confirmed' ? 'Đã xác nhận' :
                     selectedBooking.status === 'pending' ? 'Chờ xác nhận' :
                     'Đã hủy'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Thanh toán</p>
                  <p className={`text-sm ${
                    selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {selectedBooking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Họ tên</p>
                    <p className="text-sm text-gray-600">{selectedBooking.guestInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{selectedBooking.guestInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                    <p className="text-sm text-gray-600">{selectedBooking.guestInfo.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Thông tin đặt phòng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Check-in</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Check-out</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tổng tiền</p>
                    <p className="text-sm text-gray-600">{selectedBooking.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement; 