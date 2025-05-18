import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    starRating: 3,
    amenities: [],
    images: []
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await networkAdapter.get('api/partner/hotels');
      if (response.success) {
        setHotels(response.data);
      } else {
        setError('Không thể tải danh sách khách sạn');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
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
      const response = await networkAdapter.post('api/partner/hotels', formData);
      if (response.success) {
        setShowAddModal(false);
        fetchHotels();
        resetForm();
      } else {
        setError(response.message || 'Không thể tạo khách sạn mới');
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
      const response = await networkAdapter.put(`api/partner/hotels/${selectedHotel._id}`, formData);
      if (response.success) {
        setShowEditModal(false);
        fetchHotels();
        resetForm();
      } else {
        setError(response.message || 'Không thể cập nhật khách sạn');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) {
      try {
        const response = await networkAdapter.delete(`api/partner/hotels/${hotelId}`);
        if (response.success) {
          fetchHotels();
        } else {
          setError(response.message || 'Không thể xóa khách sạn');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      description: '',
      starRating: 3,
      amenities: [],
      images: []
    });
    setSelectedHotel(null);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khách sạn</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm khách sạn mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="border rounded-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={hotel.images[0] || '/placeholder-hotel.jpg'}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
                {hotel.starRating} ⭐
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{hotel.address}</p>
              <p className="text-gray-600 text-sm mb-4">{hotel.city}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  hotel.status === 'approved' ? 'bg-green-100 text-green-800' :
                  hotel.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {hotel.status === 'approved' ? 'Đã duyệt' :
                   hotel.status === 'pending' ? 'Chờ duyệt' :
                   'Từ chối'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setFormData(hotel);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Thêm khách sạn mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách sạn
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
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xếp hạng sao
                  </label>
                  <select
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {[1, 2, 3, 4, 5].map(star => (
                      <option key={star} value={star}>{star} sao</option>
                    ))}
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
                  {['Wifi', 'Hồ bơi', 'Phòng gym', 'Nhà hàng', 'Spa', 'Parking'].map(amenity => (
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
                      alt={`Hotel ${index + 1}`}
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
                  Thêm khách sạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Sửa thông tin khách sạn</h3>
            <form onSubmit={handleEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách sạn
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
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xếp hạng sao
                  </label>
                  <select
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {[1, 2, 3, 4, 5].map(star => (
                      <option key={star} value={star}>{star} sao</option>
                    ))}
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
                  {['Wifi', 'Hồ bơi', 'Phòng gym', 'Nhà hàng', 'Spa', 'Parking'].map(amenity => (
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
                      alt={`Hotel ${index + 1}`}
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
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement; 