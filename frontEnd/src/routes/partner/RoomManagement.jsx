import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    hotelId: '',
    name: '',
    type: '',
    price: '',
    capacity: '',
    description: '',
    amenities: [],
    images: [],
    status: 'available'
  });

  // Dữ liệu mẫu cho phòng
  const defaultRooms = [
    {
      _id: '1',
      hotelId: '1',
      name: 'Phòng Deluxe',
      type: 'deluxe',
      price: 1500000,
      capacity: 2,
      description: 'Phòng Deluxe với view thành phố',
      amenities: ['Wifi', 'TV', 'Mini bar'],
      images: ['/placeholder-room.jpg'],
      status: 'available'
    },
    {
      _id: '2',
      hotelId: '1',
      name: 'Phòng Suite',
      type: 'suite',
      price: 2500000,
      capacity: 4,
      description: 'Phòng Suite rộng rãi với phòng khách riêng',
      amenities: ['Wifi', 'TV', 'Mini bar', 'Bồn tắm'],
      images: ['/placeholder-room.jpg'],
      status: 'booked'
    }
  ];

  useEffect(() => {
    fetchHotels();
    fetchRooms();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await networkAdapter.get('api/partner/hotels');
      if (response.success) {
        setHotels(response.data);
      }
    } catch (err) {
      setError('Không thể tải danh sách khách sạn');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await networkAdapter.get('api/partner/rooms');
      if (response.success) {
        setRooms(response.data);
      } else {
        setError('Không thể tải danh sách phòng');
        setRooms(defaultRooms);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      setRooms(defaultRooms);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await networkAdapter.post('api/upload/images', formData);
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...response.data.urls]
        }));
      }
    } catch (err) {
      setError('Không thể tải lên ảnh');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await networkAdapter.post('api/partner/rooms', formData);
      if (response.success) {
        setShowAddModal(false);
        fetchRooms();
        resetForm();
      } else {
        setError(response.message || 'Không thể tạo phòng mới');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await networkAdapter.put(`api/partner/rooms/${selectedRoom._id}`, formData);
      if (response.success) {
        setShowEditModal(false);
        fetchRooms();
        resetForm();
      } else {
        setError(response.message || 'Không thể cập nhật phòng');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        const response = await networkAdapter.delete(`api/partner/rooms/${roomId}`);
        if (response.success) {
          fetchRooms();
        } else {
          setError(response.message || 'Không thể xóa phòng');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hotelId: '',
      name: '',
      type: '',
      price: '',
      capacity: '',
      description: '',
      amenities: [],
      images: [],
      status: 'available'
    });
    setSelectedRoom(null);
  };

  const renderRoomCard = (room) => (
    <div key={room._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={room.images[0] || '/placeholder-room.jpg'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-sm">
          {room.capacity} người
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-lg font-semibold text-white">{room.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-2">
          {hotels.find(h => h._id === room.hotelId)?.name || 'Khách sạn không xác định'}
        </p>
        <p className="text-gray-600 text-sm mb-2">{room.type}</p>
        <p className="text-gray-600 text-sm mb-4">{room.price.toLocaleString('vi-VN')} VNĐ/đêm</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities?.slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs ${
            room.status === 'available' ? 'bg-green-100 text-green-800' :
            room.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {room.status === 'available' ? 'Còn trống' :
             room.status === 'booked' ? 'Đã đặt' :
             'Không khả dụng'}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => {
                setSelectedRoom(room);
                setFormData(room);
                setShowEditModal(true);
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              title="Chỉnh sửa"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(room._id)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
              title="Xóa"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý phòng</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm phòng mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-brand animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(renderRoomCard)}
        </div>
      )}

      {/* Modal thêm phòng */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Thêm phòng mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khách sạn
                  </label>
                  <select
                    name="hotelId"
                    value={formData.hotelId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Chọn khách sạn</option>
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại phòng
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá phòng (VNĐ/đêm)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="available">Còn trống</option>
                    <option value="booked">Đã đặt</option>
                    <option value="unavailable">Không khả dụng</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiện ích
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Wifi', 'TV', 'Mini bar', 'Điều hòa', 'Bồn tắm', 'Tủ lạnh'].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Room ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-brand text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Thêm phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa phòng */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chỉnh sửa phòng</h3>
            <form onSubmit={handleEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khách sạn
                  </label>
                  <select
                    name="hotelId"
                    value={formData.hotelId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Chọn khách sạn</option>
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại phòng
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá phòng (VNĐ/đêm)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="available">Còn trống</option>
                    <option value="booked">Đã đặt</option>
                    <option value="unavailable">Không khả dụng</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiện ích
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Wifi', 'TV', 'Mini bar', 'Điều hòa', 'Bồn tắm', 'Tủ lạnh'].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Room ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-brand text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Cập nhật phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement; 