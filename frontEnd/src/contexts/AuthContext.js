import React, { createContext, useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';

export const AuthContext = createContext();

/**
 * Cung cấp trạng thái xác thực và thông tin chi tiết người dùng cho ứng dụng.
 * @namespace AuthProvider
 * @component
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [authCheckTrigger, setAuthCheckTrigger] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await networkAdapter.get('api/users/auth-user');
        // console.log("Auth check response:", response);
        if (response && response.data) {
          setIsAuthenticated(response.success);
          setUserDetails(response.data);
        } else {
          setIsAuthenticated(false);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUserDetails(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuthStatus();
  }, [authCheckTrigger]);

  // useEffect(() => {
  //   console.log("🧾 userDetails updated:", userDetails);
  // }, [userDetails]);

  const triggerAuthCheck = async () => {
    setAuthCheckTrigger((prev) => !prev);
    await new Promise(resolve => setTimeout(resolve, 100)); // Đảm bảo state được cập nhật
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        setUserDetails,
        userDetails,
        loading,
        triggerAuthCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
