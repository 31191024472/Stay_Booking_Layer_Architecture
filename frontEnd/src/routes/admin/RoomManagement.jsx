import axios from 'axios';
import { useEffect, useState } from 'react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    hotelCode: '',
    roomType: 'Standard',
    description: '',
    pricePerNight: 0,
    maxOccupancy: 2,
    bedType: '',
    amenities: '',
    totalRooms: 1,
    availableRooms: 1,
    isActive: true,
    discount: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/rooms'
        );
        setRooms(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHotels = async () => {
      try {
        const hotelResponse = await axios.get(
          'http://localhost:5000/api/admin/hotels'
        );
        setHotels(hotelResponse.data.hotels);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách sạn', error);
      }
    };

    fetchRooms();
    fetchHotels();
  }, []);

  const getHotelNameByCode = (hotelCode) => {
    if (!hotels || hotels.length === 0) {
      return 'Không tìm thấy khách sạn';
    }
    const hotel = hotels.find((h) => h.hotelCode === hotelCode);
    return hotel ? hotel.title : 'Không tìm thấy khách sạn';
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleCreateOrUpdateRoom = async () => {
    const formData = new FormData();

    Object.keys(newRoom).forEach((key) => {
      if (key === 'discount') return; // bỏ qua discount ở vòng này

      if (key === 'amenities') {
        formData.append(key, newRoom[key].split(','));
      } else {
        formData.append(key, newRoom[key]);
      }
    });

    // ✅ xử lý discount riêng, convert thành object string
    const discountObj = {
      percentage: Number(newRoom.discount) || 0,
    };
    formData.append('discount', JSON.stringify(discountObj));

    selectedFiles.forEach((file) => formData.append('images', file));

    try {
      if (editingRoomId) {
        await axios.put(
          `http://localhost:5000/api/admin/rooms/${editingRoomId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        alert('Phòng đã được cập nhật!');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/admin/rooms',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setRooms([...rooms, response.data.data]);
        alert('Phòng đã được tạo!');
      }
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu phòng', error);
    }
  };

  const handleEditRoom = (room) => {
    setNewRoom({
      hotelCode: room.hotelCode,
      roomType: room.roomType,
      description: room.description,
      pricePerNight: room.pricePerNight,
      maxOccupancy: room.maxOccupancy,
      bedType: room.bedType,
      amenities: room.amenities.join(','),
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
      isActive: room.isActive,
      discount: room.discount.percentage,
    });
    setEditingRoomId(room._id);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/rooms/${roomId}`);
      setRooms(rooms.filter((room) => room._id !== roomId));
      alert('Phòng đã bị xóa!');
    } catch (error) {
      console.error('Lỗi khi xóa phòng', error);
    }
  };

  const resetForm = () => {
    setNewRoom({
      hotelCode: '',
      roomType: 'Standard',
      description: '',
      pricePerNight: 0,
      maxOccupancy: 2,
      bedType: '',
      amenities: '',
      totalRooms: 1,
      availableRooms: 1,
      isActive: true,
      discount: 0,
    });
    setSelectedFiles([]);
    setEditingRoomId(null);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Quản lý Phòng</h2>

      <form className="mb-4 space-y-2">
        <input
          type="number"
          placeholder="Mã khách sạn"
          value={newRoom.hotelCode}
          onChange={(e) =>
            setNewRoom({ ...newRoom, hotelCode: Number(e.target.value) })
          }
          className="border p-2 block w-full"
        />

        <select
          value={newRoom.roomType}
          onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
          className="border p-2 block w-full"
        >
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
          <option value="Executive">Executive</option>
        </select>

        <textarea
          placeholder="Mô tả"
          value={newRoom.description}
          onChange={(e) =>
            setNewRoom({ ...newRoom, description: e.target.value })
          }
          className="border p-2 block w-full"
        />

        <input
          type="number"
          placeholder="Giá mỗi đêm"
          value={newRoom.pricePerNight}
          onChange={(e) =>
            setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })
          }
          className="border p-2 block w-full"
        />

        <input
          type="text"
          placeholder="Loại giường (bedType)"
          value={newRoom.bedType}
          onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
          className="border p-2 block w-full"
        />

        <input
          type="number"
          placeholder="Số người tối đa (maxOccupancy)"
          value={newRoom.maxOccupancy}
          onChange={(e) =>
            setNewRoom({ ...newRoom, maxOccupancy: Number(e.target.value) })
          }
          className="border p-2 block w-full"
        />

        <input
          type="text"
          placeholder="Tiện nghi (amenities, cách nhau bởi dấu phẩy)"
          value={newRoom.amenities}
          onChange={(e) =>
            setNewRoom({ ...newRoom, amenities: e.target.value })
          }
          className="border p-2 block w-full"
        />

        <input
          type="number"
          placeholder="Tổng số phòng (totalRooms)"
          value={newRoom.totalRooms}
          onChange={(e) =>
            setNewRoom({ ...newRoom, totalRooms: Number(e.target.value) })
          }
          className="border p-2 block w-full"
        />

        <input
          type="number"
          placeholder="Phòng còn trống (availableRooms)"
          value={newRoom.availableRooms}
          onChange={(e) =>
            setNewRoom({ ...newRoom, availableRooms: Number(e.target.value) })
          }
          className="border p-2 block w-full"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newRoom.isActive}
            onChange={(e) =>
              setNewRoom({ ...newRoom, isActive: e.target.checked })
            }
          />
          Hiển thị phòng (isActive)
        </label>

        <input
          type="number"
          placeholder="Giảm giá (%)"
          value={newRoom.discount}
          onChange={(e) =>
            setNewRoom({ ...newRoom, discount: Number(e.target.value) })
          }
          className="border p-2 block w-full"
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 block w-full"
        />

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCreateOrUpdateRoom}
            className={`px-4 py-2 rounded text-white ${editingRoomId ? 'bg-green-500' : 'bg-blue-500'}`}
          >
            {editingRoomId ? 'Cập nhật phòng' : 'Thêm phòng'}
          </button>
          {editingRoomId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full border table-auto text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Khách sạn</th>
              <th className="border p-2">Loại phòng</th>
              <th className="border p-2">Mô tả</th>
              <th className="border p-2">Giá</th>
              <th className="border p-2">Giảm giá (%)</th>
              <th className="border p-2">Hình ảnh</th>
              <th className="border p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td className="border p-2">
                  {getHotelNameByCode(room.hotelCode)}
                </td>
                <td className="border p-2">{room.roomType}</td>
                <td className="border p-2">{room.description}</td>
                <td className="border p-2">{room.pricePerNight}</td>
                <td className="border p-2">
                  {room.discount?.percentage || 0}%
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 flex-wrap">
                    {room.imageUrls?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Room ${index}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                    onClick={() => handleEditRoom(room)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 px-2 py-1 rounded text-white"
                    onClick={() => handleDeleteRoom(room._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoomManagement;
