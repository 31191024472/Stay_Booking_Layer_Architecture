import { useEffect } from 'react';

/**
 * Một hook tùy chỉnh kích hoạt một hàm callback khi sự kiện nhấp chuột xảy ra bên ngoài một phần tử được chỉ định.
 *
 * @param {React.RefObject} ref - Đối tượng ref của React được gắn vào phần tử cần theo dõi sự kiện nhấp chuột bên ngoài.
 * @param {Function} onOutsideClick - Hàm callback được thực thi khi phát hiện nhấp chuột bên ngoài.
 */


const useOutsideClickHandler = (ref, onOutsideClick) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(event);
      }
    };

    // Gán sự kiện lắng nghe
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
    // Hủy sự kiện lắng nghe khi component bị unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

export default useOutsideClickHandler;