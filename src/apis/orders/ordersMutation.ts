import http from "../../utils/https";
import dayjs from "dayjs";

export const ordersApi = {
  getAllOrders: async (
    status: string = "",
    minOrderDate?: Date,
    maxOrderDate?: Date,
    searchTerm?: string
  ): Promise<Order[]> => {
    try {
      const params = new URLSearchParams({
        page: "0",
        size: "50",
        direction: "ASC",
      });

      if (status) {
        params.append("status", status);
      }

      if (minOrderDate) {
        console.log("minOrderDate", minOrderDate);

        params.append("minOrderDate", dayjs(minOrderDate).format("YYYY-MM-DDTHH:mm:ss"));
      }

      if (maxOrderDate) {
        console.log("maxOrderDate", maxOrderDate);
        params.append("maxOrderDate", dayjs(maxOrderDate).format("YYYY-MM-DDTHH:mm:ss"));
      }

      if (searchTerm) {
        params.append("userName", searchTerm);
      }

      const response = await http.get(`orders?${params.toString()}`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data.content as Order[];
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  getOrderByID: async (id: number): Promise<Order> => {
    try {
      console.log("id", id);

      const response = await http.get(`orders/${id}`);
      console.log("resres", response);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      console.log("data", response.data);

      return response.data.data as Order;
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  updateStatus: async ({ id, status }: { id: number; status: string }) => {
    try {
      console.log("id tAx", id);
      console.log("status tAx", { status });
      const response = await http.patch(`orders/${id}/status`, { status });

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
