import { Flower } from "../../types/flower.type";
import http from "../../utils/https";

export const floweriestApi = {
  getAllFlowers: async (): Promise<Flower[]> => {
    try {
      const response = await http.get(`flowers?page=0&size=50&direction=ASC`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data.content as Flower[];
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },
  addFlower: async ({ name, flowerType, color, price, image,isActive }: Flower): Promise<Flower> => {
    const newFlower = { name, flowerType, color, price, image ,isActive };

console.log("newFlower",newFlower);



    try {
      const response = await http.post(`flowers`, newFlower);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data as Flower;
    } catch (error) {
      console.error("Fetch categories failed:", error);
      return Promise.reject(error);
    }
  },
  getFlowersById: async (flowerId: number): Promise<Flower> => {
    try {
      const response = await http.get(`flowers/${flowerId}`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data as Flower;
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  updateFlower: async ({ flowerId, name, flowerType, color, price, image, isActive }: Flower): Promise<Flower> => {
    const updateFlowerBody = { name, flowerType, color, price, image, isActive };

    console.log("updateFlowerBody", updateFlowerBody);

    try {
      const response = await http.put(`flowers/${flowerId}`, updateFlowerBody);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data as Flower;
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },
};
