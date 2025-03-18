import http from "../../utils/https";

export const ordersApi = {
  getAllOrders: async (status: string = ""): Promise<Order[]> => {
    try {
      const params = new URLSearchParams({
        page: "0",
        size: "50",
        direction: "ASC",
      });

      if (status) {
        params.append("status", status);
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
};
