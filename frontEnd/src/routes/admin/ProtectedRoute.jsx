import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext.js';

const ProtectedRoute = ({ role }) => {
  const { userDetails, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // Hiển thị loading trong khi kiểm tra trạng thái đăng nhập

  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }

  if (role && userDetails.role !== role) {
    return <Navigate to="/" replace />; // Nếu không đúng quyền, chuyển hướng về trang chủ
  }

  return <Outlet />;
};

export default ProtectedRoute;
