import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import NavbarItems from 'components/navbar-items/NavbarItems';

/**
 * **Component HamburgerMenu**
 * Hiển thị menu hamburger với các liên kết điều hướng. 
 * Menu này có thể được bật hoặc ẩn đi bằng cách nhấn vào biểu tượng đóng/mở.
 * Menu chứa các liên kết đến **Trang chủ, Khách sạn, Giới thiệu**, và tùy thuộc vào trạng thái đăng nhập,
 * sẽ hiển thị liên kết đến **trang cá nhân của người dùng** hoặc **trang đăng nhập/đăng ký**.
 *
 * @param {Object} props - Các thuộc tính được truyền vào component.
 * @param {boolean} props.isVisible - Kiểm soát trạng thái hiển thị của menu hamburger.
 * @param {Function} props.onHamburgerMenuToggle - Hàm callback để chuyển đổi trạng thái hiển thị của menu.
 * @param {boolean} props.isAuthenticated - Xác định xem người dùng đã đăng nhập hay chưa.
 */

const HamburgerMenu = (props) => {
  const { isVisible, onHamburgerMenuToggle, isAuthenticated } = props;

  return (
    <div
      data-testid="hamburger-menu"
      className={`bg-brand shadow-2xl z-20 ${
        isVisible ? 'fixed right-0 w-1/2 top-0 h-screen' : 'hidden'
      }`}
    >
      <div className="absolute right-5 top-2">
        <FontAwesomeIcon
          data-testid="menu-close__button"
          icon={faXmark}
          size="2x"
          color="#fff"
          onClick={onHamburgerMenuToggle}
        />
      </div>
      <ul className="list-none mt-12">
        <NavbarItems
          onHamburgerMenuToggle={onHamburgerMenuToggle}
          isAuthenticated={isAuthenticated}
        />
      </ul>
    </div>
  );
};

export default HamburgerMenu;