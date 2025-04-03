import React, { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter'; // giả sử bạn có dịch vụ gọi API
import HotelItem from './HotelItem'; // Component hiển thị từng khách sạn
import HotelForm from './HotelForm'; // Component thêm hoặc sửa khách sạn

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await networkAdapter.get('/api/hotels');
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleAddHotel = (newHotel) => {
    setHotels([...hotels, newHotel]); // Thêm khách sạn vào danh sách
  };

  const handleDeleteHotel = (hotelId) => {
    setHotels(hotels.filter(hotel => hotel.id !== hotelId)); // Xóa khách sạn
  };

  return (
    <div>
      <h2>Quản lý Khách Sạn</h2>
      <HotelForm onAddHotel={handleAddHotel} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {hotels.map((hotel) => (
            <HotelItem key={hotel.id} hotel={hotel} onDelete={handleDeleteHotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
