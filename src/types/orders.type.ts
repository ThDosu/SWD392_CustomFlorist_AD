// Định nghĩa kiểu dữ liệu trả về từ API
interface BouquetFlower {
  flowerId: number;
  flowerName: string;
  quantity: number;
}

interface OrderItem {
  orderItemId: number;
  bouquetId: number;
  bouquetName: string;
  quantity: number;
  subTotal: number;
  isActive: boolean;
  bouquetFlowers: BouquetFlower[];
}

interface Order {
  orderId: number;
  userId: number;
  userName: string;
  promotionId: number;
  orderDate: number[]; // Nếu cần, có thể chuyển thành Date
  status: string;
  totalPrice: number;
  shippingAddress: string;
  isActive: boolean;
  orderItems: OrderItem[];
}
