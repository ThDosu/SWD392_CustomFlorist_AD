import React from "react";

// Định nghĩa kiểu trạng thái đơn hàng
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled";

// Hàm trả về một <span> với màu phù hợp
const renderOrderStatus = (status?: string): JSX.Element => {
  if (!status) return <span style={{ color: "gray", fontWeight: "bold" }}>Không xác định</span>;

  // Chuyển trạng thái về chữ thường để tránh lỗi nhập sai định dạng
  const normalizedStatus = status.toLowerCase() as OrderStatus;

  // Map trạng thái với màu và nhãn hiển thị
  const statusMap: Record<OrderStatus, { color: string; label: string }> = {
    pending: { color: "orange", label: "Chờ xác nhận" },
    processing: { color: "blue", label: "Đang xử lý" },
    shipped: { color: "purple", label: "Đang giao hàng" },
    delivered: { color: "cyan", label: "Đã giao hàng" },
    completed: { color: "green", label: "Hoàn thành" },
    cancelled: { color: "red", label: "Đã hủy" },
  };

  // Kiểm tra trạng thái hợp lệ, nếu không có thì trả về mặc định
  const { color, label } = statusMap[normalizedStatus] || {
    color: "gray",
    label: "Không xác định",
  };

  return <span style={{ color, fontWeight: "bold" }}>{label}</span>;
};

export default renderOrderStatus;
