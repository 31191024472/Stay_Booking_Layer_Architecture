import GlobalFooter from 'components/global-footer/GlobalFooter';
import GlobalNavbar from 'components/global-navbar/GlobalNavbar';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'components/scroll-to-top/ScrollToTop';

/**
 * Thành phần BaseLayout
 * Hiển thị bố cục cơ bản của ứng dụng.
 * Thành phần này bao gồm thanh điều hướng toàn cục, nội dung chính và chân trang toàn cục.
 * @returns {JSX.Element} - Thành phần BaseLayout.
 */

const BaseLayout = () => {
  return (
    <>
      <GlobalNavbar />
      <ScrollToTop />
      <Outlet />
      <GlobalFooter />
    </>
  );
};

export default BaseLayout;