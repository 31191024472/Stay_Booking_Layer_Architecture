import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Một component giúp cuộn lên đầu trang khi đường dẫn thay đổi.
 * @component
 * @returns {null}
 */

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}