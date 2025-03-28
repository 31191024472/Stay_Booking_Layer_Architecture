import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/ux/dropdown-button/DropdownButton';
import { networkAdapter } from 'services/NetworkAdapter';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

/**
 * Thành phần hiển thị các mục điều hướng trên thanh navbar cho cả phiên bản di động và máy tính.
 *
 * @param {Object} props - Thuộc tính đầu vào của thành phần.
 * @param {boolean} props.isAuthenticated - Cờ xác định xem người dùng đã đăng nhập hay chưa.
 * @param {Function} props.onHamburgerMenuToggle - Hàm xử lý khi nhấn vào menu hamburger.
 */


const NavbarItems = ({ isAuthenticated, onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);

   /**
   * Xử lý hành động đăng xuất bằng cách gọi API logout và cập nhật trạng thái xác thực.
   */
  const handleLogout = async () => {
    await networkAdapter.post('api/users/logout');
    context.triggerAuthCheck();
    navigate('/login');
  };

  const dropdownOptions = [
    { name: 'Thông tin', onClick: () => navigate('/user-profile') },
    { name: 'Đăng xuất', onClick: handleLogout },
  ];

  /**
   * Xác định xem đường dẫn được cung cấp có phải là đường dẫn hiện tại hay không.
   *
   * @param {string} path - Đường dẫn cần kiểm tra.
   * @returns {boolean} - Trả về true nếu đường dẫn đang hoạt động, ngược lại là false.
   */

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Trang chủ
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/hotels"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/hotels') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Khách sạn
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/about-us"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/about-us') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Giới thiệu
        </Link>
      </li>
      <li
        className={`${!isAuthenticated && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isAuthenticated ? (
          <DropdownButton triggerType="click" options={dropdownOptions} />
        ) : (
          <Link
            to="/login"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${
              isActive('/login') && 'active-link'
            }`}
            onClick={onHamburgerMenuToggle}
          >
            Đăng nhập/Đăng ký
          </Link>
        )}
      </li>
    </>
  );
};

export default NavbarItems;