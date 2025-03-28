/**
 * Đối tượng tiện ích dùng để kiểm tra tính hợp lệ của các trường dữ liệu.
 * @namespace validations
 */
const validations = {
    /**
     * Các quy tắc kiểm tra tính hợp lệ cho các trường dữ liệu.
     * @memberof validations
     * @property {object} email - Quy tắc kiểm tra cho trường email.
     * @property {boolean} email.required - Xác định xem trường email có bắt buộc không.
     * @property {RegExp} email.pattern - Biểu thức chính quy để kiểm tra định dạng email.
     */
    fields: {
      email: {
        required: true, // Trường email là bắt buộc
        pattern: /^[^\s-]\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}[^\s-]$/i, // Biểu thức kiểm tra định dạng email
      },
    },
  
    /**
     * Hàm kiểm tra tính hợp lệ của một giá trị dựa trên quy tắc đã xác định.
     * @memberof validations
     * @param {string} field - Tên trường cần kiểm tra.
     * @param {string} value - Giá trị của trường cần kiểm tra.
     * @returns {boolean} - Trả về `true` nếu giá trị hợp lệ, ngược lại `false`.
     */
    validate(field, value) {
      return this.fields[field] ? this.fields[field].pattern.test(value) : false;
    },
  };
  
  export default validations;
  