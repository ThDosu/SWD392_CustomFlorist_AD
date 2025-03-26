import { UserRes } from "../../types/user.type";
import http from "../../utils/https";

export const userApi = {
  getAllUser: async (): Promise<UserRes[]> => {
    try {
      const response = await http.get(`users?page=0&size=50`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data.content as UserRes[];
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  getUserByID: async (id: number): Promise<UserRes> => {
    try {
      const response = await http.get(`users/${id}`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data as UserRes;
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  updateStatus: async ({ id, accountStatus }: { id: number; accountStatus: boolean }) => {
    try {
      console.log("id tAx", id);
      console.log("status tAx", { accountStatus });
      const response = await http.patch(`users/${id}/status?active=${accountStatus}`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      console.log("data", response.data);
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  updateRole: async ({ id, role }: { id: number; role: string }) => {
    let newRole = role;

    console.log("role", role);

    try {
      const response = await http.patch(`users/${id}/role`, { newRole });

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      console.log("data", response.data);
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },
};
