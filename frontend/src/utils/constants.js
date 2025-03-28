/**
 * Số lượng khách tối đa được phép nhập
 */
export const MAX_GUESTS_INPUT_VALUE = 10;

/**
 * Thông báo liên quan đến đăng ký người dùng.
 */
export const REGISTRATION_MESSAGES = {
  SUCCESS: 'Tạo tài khoản thành công. Đang chuyển hướng đến trang đăng nhập...',
};

/**
 * Thông báo liên quan đến đăng nhập người dùng.
 */
export const LOGIN_MESSAGES = {
  FAILED: 'Vui lòng nhập email và mật khẩu hợp lệ',
};

/**
 * Thể hiện chi tiết thuế mặc định cho việc đặt phòng khách sạn.
 */
export const DEFAULT_TAX_DETAILS =
  'Thuế VTA: 5% cho đơn từ 0 - 2.500.000 VND, 8% cho đơn từ 2.500.000 - 7.500.000 VND, 10% cho đơn từ 7.500.000 VND trở lên';

/**
 * Nhãn bộ lọc sắp xếp
 */
export const SORTING_FILTER_LABELS = Object.freeze({
  PRICE_LOW_TO_HIGH: 'Giá: Thấp đến Cao',
  PRICE_HIGH_TO_LOW: 'Giá: Cao đến Thấp',
  RATING_LOW_TO_HIGH: 'Xếp hạng: Thấp đến Cao',
  RATING_HIGH_TO_LOW: 'Xếp hạng: Cao đến Thấp',
});