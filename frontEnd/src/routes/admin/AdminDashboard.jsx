import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <Link to="/admin/hotels">Quản lý Khách Sạn</Link>
      </div>
      <div>
        <Link to="/admin/users">Quản lý Người Dùng</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
