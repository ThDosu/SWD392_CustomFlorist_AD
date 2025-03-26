// import axios, { AxiosError } from "axios";
// import { HttpStatusCode } from "../constants/HttpStatusCode.enum";
// import { ErrorResponse } from "../types/utils.type";

// // type redicate
// export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
//   return axios.isAxiosError(error as any);
// }

// //  đây là hàm dùng để check lỗi có phải 422
// export function isAxiosUnprocessableEntityError<FromError>(error: unknown): error is AxiosError<FromError> {
//   return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
// }

// //  đây là hàm dùng để check lỗi có phải 401
// export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
//   return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
// }
// //  đây là hàm dùng để check lỗi có phải 401
// export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
//   return (
//     isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
//     error.response?.data.data?.name === "EXPIRED_TOKEN"
//   );
// }
