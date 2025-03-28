import React, { useState, useEffect } from 'react';
import Toast from 'components/ux/toast/Toast';
import { networkAdapter } from 'services/NetworkAdapter';
import Select from 'react-select';

/**
* Hiển thị bảng thông tin chi tiết về hồ sơ người dùng.
* @component
* @param {Object} props - Các props của thành phần.
* @param {Object} props.userDetails - Các thông tin chi tiết của người dùng.
* @returns {JSX.Element} Thành phần được hiển thị.
* */

const ProfileDetailsPanel = ({ userDetails }) => {
  // // trạng thái để quản lý chế độ chỉnh sửa và thông tin chi tiết của người dùng
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [nationality, setNationality] = useState('');
  const [countries, setCountries] = useState([]);

  const [toastMessage, setToastMessage] = useState('');

  const clearToastMessage = () => {
    setToastMessage('');
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelClick = () => {
    setIsEditMode(!isEditMode);
  };

/**
* Xử lý sự kiện nhấp vào nút lưu.
* Cập nhật thông tin chi tiết của người dùng và đặt chế độ chỉnh sửa thành sai.
* */

  const handleSaveClick = async () => {
    // kiểm tra xem trạng thái mới có khác với trạng thái cũ không
    if (
      firstName === userDetails.firstName &&
      lastName === userDetails.lastName &&
      phoneNumber === userDetails.phone &&
      nationality === userDetails.country
    ) {
      setIsEditMode(false);
      return;
    }

    const updatedUserDetails = {
      firstName,
      lastName,
      phoneNumber,
      country: nationality,
    };
    // Gọi API để cập nhật thông tin chi tiết của người dùng
    const response = await networkAdapter.patch(
      '/api/users/update-profile',
      updatedUserDetails
    );
    if (response && response.data.status) {
      setToastMessage({
        type: 'success',
        message: response.data.status,
      });
    } else {
     // trở về trạng thái ban đầu
      setFirstName(userDetails.firstName);
      setLastName(userDetails.lastName);
      setPhoneNumber(userDetails.phone);
      setNationality(userDetails.country);
      setToastMessage({
        type: 'error',
        message: 'Oops, something went wrong. Please try again later.',
      });
    }

    setIsEditMode(false);
  };

  // hiệu ứng để thiết lập trạng thái ban đầu của thông tin chi tiết người dùng
  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || '');
      setLastName(userDetails.lastName || '');
      setEmail(userDetails.email || '');
      setPhoneNumber(userDetails.phone || '');
      setNationality(userDetails.country || '');
      setIsEmailVerified(userDetails.isEmailVerified || '');
      setIsPhoneVerified(userDetails.isPhoneVerified || '');
      setDateOfBirth(userDetails.dateOfBirth || '');
    }
  }, [userDetails]);

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesData = await networkAdapter.get('/api/misc/countries');
      if (countriesData && countriesData.data) {
        console.log('countriesData', countriesData.data);
        const mappedValues = countriesData.data.elements.map((country) => ({
          label: country.name,
          value: country.name,
        }));
        setCountries(mappedValues);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="bg-white shadow sm:rounded-lg flex flex-col">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900">
            Thông tin cá nhân
        </h3>
        <p className="mt-1 max-w-2xl text-gray-500">
            Giữ thông tin của bạn luôn cập nhật để đảm bảo liên lạc và dịch vụ diễn ra suôn sẻ.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {isEditMode ? (
            // Editable fields
            <>
              <TextField
                label="Firstname"
                value={firstName}
                onChange={setFirstName}
              />
              <TextField
                label="Lastname"
                value={lastName}
                onChange={setLastName}
              />
              <TextField
                label="Phone number"
                type="tel"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
              <TextField
                label="Date of birth"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
              <div className="relative">
                <TextField
                  label="Country"
                  value={nationality}
                  onChange={setNationality}
                  isSelectable={true}
                  selectableData={countries}
                />
              </div>
            </>
          ) : (
            // Display fields
            <>
              <DisplayField label="Tên" value={firstName} />
              <DisplayField label="Họ" value={lastName} />
              <DisplayField
                label="Email"
                value={email}
                verified={isEmailVerified}
              />
              <DisplayField
                label="Điện thoại"
                value={phoneNumber || 'Thêm số điện thoại'}
                verified={isPhoneVerified}
              />
              <DisplayField
                label="Date of birth"
                value={dateOfBirth || 'Thêm ngày sinh'}
              />
              <DisplayField label="Quốc tịch" value={nationality} />
            </>
          )}
        </dl>
      </div>
      <div className="flex justify-between px-4 py-3 bg-gray-50 text-right sm:px-6">
        {isEditMode ? (
          <>
            <button
              onClick={handleCancelClick}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Huỷ
            </button>
            <button
              onClick={handleSaveClick}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lưu
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Chỉnh sửa 
          </button>
        )}
      </div>
      {toastMessage && (
        <div className="m-2">
          <Toast
            type={toastMessage.type}
            message={toastMessage.message}
            dismissError={clearToastMessage}
          />
        </div>
      )}
    </div>
  );
};

const DisplayField = ({ label, value, verified }) => (
  <div
    className={`bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${
      verified ? 'bg-gray-50' : ''
    }`}
  >
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
      {value}{' '}
      {verified && <span className="text-green-500 font-medium">Đã xác minh</span>}
    </dd>
  </div>
);

const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  isSelectable,
  selectableData,
}) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">
      {isSelectable ? (
        <Select
          options={selectableData}
          value={selectableData.find((country) => country.value === value)}
          onChange={(selectedOption) => onChange(selectedOption.value)}
        />
      ) : (
        <input
          type={type}
          className="mt-1 border py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm md:text-base  rounded-md"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </dd>
  </div>
);

export default ProfileDetailsPanel;