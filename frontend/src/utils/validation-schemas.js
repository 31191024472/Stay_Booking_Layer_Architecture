import * as Yup from 'yup';
const phoneRegExp = /^\d{10}$/; // Biểu thức chính quy kiểm tra số điện thoại 10 chữ số

// Lớp chứa các schema xác thực chung
class ValidationSchema {
    static email = Yup.string().email('Email không hợp lệ').required('Bắt buộc');
  }

  // Lớp chứa schema xác thực cho từng trường hợp cụ thể, kế thừa từ ValidationSchema
  class Schemas extends ValidationSchema {
    static signupSchema = Yup.object().shape({
      firstName: Yup.string()
        .min(2, 'Quá ngắn!')
        .max(50, 'Quá dài!')
        .required('Bắt buộc'),
      lastName: Yup.string()
        .min(2, 'Quá ngắn!')
        .max(50, 'Quá dài!')
        .required('Bắt buộc'),
      email: ValidationSchema.email, // Sử dụng schema email từ lớp cha
      phoneNumber: Yup.string()
        .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
        .required('Bắt buộc'),
      password: Yup.string()
        .min(8, 'Mật khẩu quá ngắn - tối thiểu 8 ký tự.')
        .required('Bắt buộc'),
      confirmPassword: Yup.string().required('Bắt buộc'),
    });
  }
  
  export default Schemas;