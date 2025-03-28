import { useState } from 'react';
import { Link } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';
import React, { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import validations from 'utils/validations';
import Toast from 'components/ux/toast/Toast';
import { LOGIN_MESSAGES } from 'utils/constants';

/**
* Thành phần đăng nhập
* Hiển thị biểu mẫu đăng nhập cho phép người dùng đăng nhập vào tài khoản của họ.
* Xử lý thông tin người dùng nhập vào email và mật khẩu, gửi thông tin đăng nhập đến máy chủ,
* và điều hướng người dùng đến hồ sơ của họ sau khi xác thực thành công.
* Hiển thị thông báo lỗi cho các lần đăng nhập không hợp lệ.
*/
const Login = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(false);
/**
* Xử lý các thay đổi đầu vào cho các trường biểu mẫu đăng nhập.
* Cập nhật trạng thái loginData với các giá trị trường.
* @param {Object} e - Đối tượng sự kiện từ trường đầu vào.
*/

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

 
/**
 * Xử lý việc gửi biểu mẫu đăng nhập.
* Cố gắng xác thực người dùng bằng thông tin đăng nhập được cung cấp.
* Điều hướng đến hồ sơ người dùng khi đăng nhập thành công hoặc đặt thông báo lỗi khi không thành công.
* @param {Object} e - Đối tượng sự kiện từ việc gửi biểu mẫu.
*/

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (validations.validate('email', loginData.email)) {
      const response = await networkAdapter.post('api/users/login', loginData);
      if (response && response.data.token) {
        context.triggerAuthCheck();
        navigate('/user-profile');
      } else if (response && response.errors.length > 0) {
        setErrorMessage(response.errors[0]);
      }
    } else {
      setErrorMessage(LOGIN_MESSAGES.FAILED);
    }
  };


  const dismissError = () => {
    setErrorMessage('');
  };

  return (
    <>
      <div className="login__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form
            onSubmit={handleLoginSubmit}
            className="w-full max-w-lg p-4 md:p-10 shadow-md"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-brand">
                Chào mừng trở lại 
              </h2>
              <p className="text-gray-500">
                Đăng nhập để tiếp tục sử dụng tài khoản của bạn
              </p>
            </div>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleInputChange}
                autoComplete="username"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            {errorMessage && (
              <Toast
                type="error"
                message={errorMessage}
                dismissError={dismissError}
              />
            )}
            <div className="items-center">
              <div>
                <button
                  type="submit"
                  className="bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Đăng Nhập
                </button>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full">
                <Link
                  to="/forgot-password"
                  className="inline-block align-baseline text-md text-gray-500 hover:text-blue-800 text-right"
                >
                  Bạn quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-0 right-0 flex justify-center items-center">
                  <div className="border-t w-full absolute"></div>
                  <span className="bg-white px-3 text-gray-500 z-10">
                   Bạn mới sử dụng Esay Stay?
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full mt-12">
                <Link
                  to="/register"
                  className="inline-block align-baseline font-medium text-md text-brand hover:text-blue-800 text-right"
                >
                  Tạo tài khoản mới
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-slate-50 flex flex-col mx-auto w-full max-w-lg px-4">
        <small className="text-slate-600">Thông tin tài khoản thử nghiệm</small>
        <small className="text-slate-600">Email: anhphan@example.com</small>
        <small className="text-slate-600">Password: password1</small>
      </div>
    </>
  );
};

export default Login;