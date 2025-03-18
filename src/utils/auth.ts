import { User } from "../types/user.type";

// do là token hết hạn chúng ta không nên chơi reload trang chún ta dùng cách này
export const LocalStrorageEventTarget = new EventTarget();

export const setTokenToLS = (token: string) => {
  localStorage.setItem("token", token);
};

// export const saveRefreshTokenToLS = (refreshToken: string) => {
//   localStorage.setItem("refresh_token", refreshToken);
// };

// token
// export const setTokenToLS = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
//   saveAccessTokenToLS(accessToken);
//   saveRefreshTokenToLS(refreshToken);
// };

export const clearLS = () => {
  localStorage.removeItem("token");

  LocalStrorageEventTarget.dispatchEvent(new Event("clearLS"));
};

export const getTokenFormLS = () => localStorage.getItem("token") || "";
// export const getRefreshTokenFormLS = () => localStorage.getItem("refresh_token") || "";

// lấy token
// export const getTokenFromLS = () => {
//   const access_token = getAccessTokenFormLS();
//   const refresh_token = getRefreshTokenFormLS();

//   return { access_token, refresh_token };
// };

// export const getProfileFromLS = () => {
//   //  lấy xuống là string
//   const result = localStorage.getItem("profile");
//   // parse thành obj để xài
//   return result ? JSON.parse(result) : null;
// };

// lưu ở localStroge
// export const setProfileToLS = (profile: User) => {
//   localStorage.setItem("profile", JSON.stringify(profile));
// };
