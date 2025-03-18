import axios, { AxiosError, AxiosInstance } from "axios";
import config from "../constants/config";
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from "../apis/auth.api";
import { AuthResponse } from "../types/auth.type";
import { clearLS, getTokenFormLS, setTokenToLS } from "./auth";
import { HttpStatusCode } from "../constants/HttpStatusCode.enum";

// Import the correct module
export class Http {
  // khi mà chúng ta khai báo biến thì chúng ta phải khai nó trong constructor
  instance: AxiosInstance;
  private token: string;

  constructor() {
    const token = getTokenFormLS();
    // getToken*(constructor chạy) chỗ này là giúp chúng ta lưu trên thanh ram
    // Và điều này nó giúp chúng ta tốc ưu tốc độ xử lý
    this.token = token;

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        console.log(config);

        if (this.token && config) {
          config.headers.authorization = `Bearer ${this.token}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    //  cấu hình response trả về
    this.instance.interceptors.response.use(
      // chỗ này đổi thành arf để sử dụng this
      (response) => {
        console.log(response);

        const { url } = response.config;
        if (url === URL_LOGIN || url === URL_REGISTER) {
          //   const data = response.data;
          this.token = (response.data as AuthResponse).data as unknown as string;

          setTokenToLS(this.token as string);
        } else if (url === URL_LOGOUT) {
          this.token = "";

          clearLS();
        }
        return response;
      },
      //  thằng dùng để hanle lỗi mà không phải lỗi 422(lỗi linh tinh-167)
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          console.log(data);

          const message = data?.message || error.message;

          console.log(message);
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          // 401
          clearLS();
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
