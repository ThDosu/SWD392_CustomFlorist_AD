import http from "../../utils/https";

export const categoriesApi = {
  getAllCategories: async (): Promise<Catelogy[]> => {
    try {
      console.log("🚀 Gọi API categories...");

      const response = await http.get(`categories?page=0&size=50`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      console.log("content", response.data.data.content);

      return response.data.data.content as Catelogy[];
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  getCategoriesById: async (categoryId: string): Promise<UpdateCatelogy[]> => {
    try {
      const response = await http.get(`categories/${categoryId}`);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data as UpdateCatelogy[];
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  // CẬP NHẬT
  updateCategories: async ({
    id,
    name,
    description,
    is_active,
  }: {
    id: number;
    name: String;
    description: string;
    is_active: boolean;
  }): Promise<UpdateCatelogy> => {
    try {
      console.log("id", id);

      const response = await http.put(`categories/${id}`, { name, description, is_active });

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data.data as UpdateCatelogy;
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  },

  addCategories: async ({ name, description }: { name: string; description: string }): Promise<UpdateCatelogy> => {
    const categories: UpdateCatelogy = {
      name,
      description,
      is_active: true, // or false
    };

    console.log("aaa", categories);

    try {
      const response = await http.post(`categories`, categories);

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      return response.data as UpdateCatelogy;
    } catch (error) {
      console.error("Fetch categories failed:", error);
      return Promise.reject(error);
    }
  },
};
