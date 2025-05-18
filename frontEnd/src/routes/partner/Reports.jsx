import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';

const Reports = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    occupancyRate: 0,
    bookingsByMonth: [],
    revenueByMonth: []
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchStats(selectedHotel);
    }
  }, [selectedHotel, timeRange]);

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

  const fetchStats = async (hotelId) => {
    setLoading(true);
    try {
      const response = await networkAdapter.get(`api/partner/hotels/${hotelId}/stats?timeRange=${timeRange}`);
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Không thể tải thống kê');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê & Báo cáo</h2>
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
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Tổng đặt phòng</h3>
          <p className="text-2xl font-bold text-blue-700">{stats.totalBookings}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Doanh thu</h3>
          <p className="text-2xl font-bold text-green-700">{stats.totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Đánh giá trung bình</h3>
          <p className="text-2xl font-bold text-yellow-700">{stats.averageRating.toFixed(1)} ⭐</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Tỷ lệ lấp đầy</h3>
          <p className="text-2xl font-bold text-purple-700">{stats.occupancyRate}%</p>
        </div>
      </div>

      {/* Biểu đồ đặt phòng theo tháng */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Đặt phòng theo tháng</h3>
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          {/* Thêm biểu đồ ở đây */}
          <div className="flex items-end h-full space-x-2">
            {stats.bookingsByMonth.map((item, index) => (
              <div key={index} className="flex-1">
                <div
                  className="bg-brand rounded-t"
                  style={{ height: `${(item.value / Math.max(...stats.bookingsByMonth.map(b => b.value))) * 100}%` }}
                ></div>
                <div className="text-xs text-center mt-2">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          {/* Thêm biểu đồ ở đây */}
          <div className="flex items-end h-full space-x-2">
            {stats.revenueByMonth.map((item, index) => (
              <div key={index} className="flex-1">
                <div
                  className="bg-green-500 rounded-t"
                  style={{ height: `${(item.value / Math.max(...stats.revenueByMonth.map(r => r.value))) * 100}%` }}
                ></div>
                <div className="text-xs text-center mt-2">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 