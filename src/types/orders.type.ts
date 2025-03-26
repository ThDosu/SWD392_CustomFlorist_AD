interface Flower {
  flowerId: number;
  flowerName: string;
  quantity: number;
}

interface Bouquet {
  orderItemId: number;
  bouquetId: number;
  bouquetName: string;
  quantity: number;
  subTotal: number;
  isActive: boolean;
  bouquetFlowers: Flower[];
}

interface StatusHistory {
  id: number;
  status: "CANCELLED" | "DELIVERED" | "PENDING" | "SHIPPED" | "SKIP";
  changeAt: number[]; // [Year, Month, Day, Hour, Minute, Second, Microseconds]
  note: string;
}

interface DeliveryHistory {
  deliveryId: number;
  deliveryCode: string;
  isActive: boolean;
  userId: number;
  orderId: number;
  courierId: number;
  statusHistories: StatusHistory[];
}

interface Order {
  orderId: number;
  userId: number;
  userName: string;
  promotionId: number;
  orderDate: number[]; // [Year, Month, Day, Hour, Minute, Second, Microseconds]
  status: "CANCELLED" | "DELIVERED" | "PENDING" | "SHIPPED" | "SKIP";
  totalPrice: number;
  phone: string;
  shippingAddress: string;
  isActive: boolean;
  reason: string;
  orderItems: Bouquet[];
  deliveryHistories: DeliveryHistory[];
}
