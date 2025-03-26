import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { roles } from "../../types/roles";
import config from "../../constants/config";

export const REGISTER = "REGISTER";
export const LOGIN = "LOGIN";
export const VERIFY_ACCOUNT = "VERIFY_ACCOUNT";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const REGENERATE_OTP = "REGENERATE_OTP";
export const LOGIN_GOOGLE = "LOGIN_GOOGLE";

export const registerAccount = (userData, addToast) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/auth/register",
        {
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          fullname: userData.fullname,
          gender: userData.gender,
          birthday: userData.birthday,
          password: userData.password,
        }
      );

      dispatch({
        type: REGISTER,
        payload: response.data,
      });
      if (addToast)
        addToast("Đăng ký thành công! Vui lòng xác thực tài khoản.", { appearance: "success", autoDismiss: true });

      return Promise.resolve();
    } catch (error) {
      console.error("Registration failed:", error);
      if (addToast) addToast("Đăng ký thất bại.", { appearance: "error", autoDismiss: true });

      return Promise.reject(error);
    }
  };
};

export const loginAccount = (userData, addToast) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("http://localhost:8080/custom-florist/api/v1/users/login", {
        email: userData.email,
        password: userData.password,
      });
      dispatch({
        type: LOGIN,
        payload: response.data,
      });

      if (response.data) {
        const token = response.data.data;

        console.log("data", typeof token);
        const decodedToken = jwtDecode(token);
        console.log("decode", decodedToken);

        const { Email, FullName, Role, UserID } = decodedToken;
        const profile = { Email, FullName, Role, UserID };

        console.log("admin", profile.Role);
        console.log("type", typeof roles.admin.toLowerCase());

        if (
          String(profile.Role).toLowerCase().trim() === roles.admin ||
          String(profile.Role).toLowerCase().trim() === roles.manager
        ) {
          localStorage.setItem("token", token);
          localStorage.setItem("profile", JSON.stringify(profile));
          addToast("Đăng nhập thành công!", { appearance: "success", autoDismiss: true });
          return true;
        }
      }
      throw new Error();
    } catch (error) {
      console.error("Login failed:", error);
      if (addToast) addToast("Đăng nhập thất bại! Vui lòng thử lại.", { appearance: "error", autoDismiss: true });
      throw error;
    }
  };
};

export const verifyAccount = (userData, addToast) => {
  return async (dispatch) => {
    try {
      const query = new URLSearchParams({
        email: userData.email,
        otp: userData.otp,
      }).toString();

      const response = await axios.put(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/auth/verify-account?${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch({
        type: VERIFY_ACCOUNT,
        payload: response.data,
      });

      if (addToast)
        addToast("Xác thực thành công! Vui lòng đăng nhập lại.", { appearance: "success", autoDismiss: true });
    } catch (error) {
      console.error("Verification failed:", error.response ? error.response.data : error.message);
      if (addToast)
        addToast("Xác thực thất bại. " + (error.response ? error.response.data.message : error.message), {
          appearance: "error",
          autoDismiss: true,
        });
    }
  };
};

export const forgotPassword = (email, addToast) => {
  return async (dispatch) => {
    try {
      const url = `${config.baseUrl}user/reset-password/request?email=${encodeURIComponent(email)}`;
      console.log("Forgot Password URL:", url);

      const response = await axios.post(url);

      dispatch({
        type: FORGOT_PASSWORD,
        payload: response.data,
      });

      if (addToast)
        addToast("Yêu cầu đặt lại mật khẩu đã được gửi, kiểm tra email của bạn", {
          appearance: "success",
          autoDismiss: true,
        });
    } catch (error) {
      console.error("Forgot password request failed:", error);
      if (addToast) addToast("Yêu cầu đặt lại mật khẩu thất bại.", { appearance: "error", autoDismiss: true });
    }
  };
};

export const resetPassword = (userData, addToast) => {
  return async (dispatch) => {
    try {
      const url = `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/auth/set-password?email=${encodeURIComponent(
        userData.email
      )}&newPassword=${encodeURIComponent(userData.newPassword)}`;
      const response = await axios.put(url);

      dispatch({
        type: RESET_PASSWORD,
        payload: response.data,
      });

      if (addToast) addToast("Đặt lại mật khẩu thành công!", { appearance: "success", autoDismiss: true });
    } catch (error) {
      console.error("Password reset failed:", error);
      if (addToast) addToast("Đặt lại mật khẩu thất bại.", { appearance: "error", autoDismiss: true });
    }
  };
};

export const regenerateOTP = (email, addToast) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/auth/regenerate-otp?email=${encodeURIComponent(
          email
        )}`
      );
      dispatch({
        type: REGENERATE_OTP,
        payload: response.data,
      });
      if (addToast) addToast("Gửi lại mã OTP thành công!", { appearance: "success", autoDismiss: true });
    } catch (error) {
      console.error("Regenerate OTP failed:", error);
      if (addToast) addToast("Gửi lại mã OTP thất bại.", { appearance: "error", autoDismiss: true });
    }
  };
};

export const signInWithGoogle = (addToast) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/auth/signInWithGoogle",
        { withCredentials: true }
      );

      dispatch({
        type: LOGIN_GOOGLE,
        payload: response.data,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (addToast) addToast("Đăng nhập thành công!", { appearance: "success", autoDismiss: true });

      return { ok: true, data: response.data };
    } catch (error) {
      console.error("Google login failed:", error);
      if (addToast) addToast("Đăng nhập thất bại!", { appearance: "error", autoDismiss: true });
      return { ok: false, error };
    }
  };
};
