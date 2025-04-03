import React, { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter'; // giả sử bạn có dịch vụ gọi API
import UserItem from './UserItem'; // Component hiển thị từng người dùng
import UserForm from './UserForm'; // Component thêm hoặc sửa người dùng

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await networkAdapter.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]); // Thêm người dùng vào danh sách
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId)); // Xóa người dùng
  };

  return (
    <div>
      <h2>Quản lý Người Dùng</h2>
      <UserForm onAddUser={handleAddUser} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {users.map((user) => (
            <UserItem key={user.id} user={user} onDelete={handleDeleteUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
