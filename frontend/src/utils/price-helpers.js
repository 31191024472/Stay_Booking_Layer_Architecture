/**
 * Định dạng giá tiền với dấu phẩy ngăn cách hàng nghìn.
 * @param {number} price - Giá tiền cần định dạng.
 * @returns {string} - Giá tiền đã được định dạng.
 *
 * @example
 * const formattedPrice = formatPrice(1000000); // Trả về '1.000.000'
 * const formattedPrice = formatPrice(1000); // Trả về '1.000'
 */

// const formatPrice = (price) => {
//     if (!price) return parseFloat(0).toLocaleString('en-IN');
//     return parseFloat(price).toLocaleString('en-IN');
//   };
  
//   export { formatPrice };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(parseFloat(price));
  };
  
  export { formatPrice };