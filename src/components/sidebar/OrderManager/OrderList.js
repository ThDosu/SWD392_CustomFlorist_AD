import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, Empty, Input, Modal, Select, Table } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ordersApi } from "../../../apis/orders/ordersMutation";
import {
  acceptOrder,
  completedOrder,
  fetchAllOrdersByStoreID,
  fetchOrderById,
  GET_ALL_ORDERS,
  rejectOrder,
} from "../../../redux/actions/orderActions";
import { status as Istatus } from "../../../types/roles";

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const storeID = localStorage.getItem("storeID");

  const { data: ordersData, refetch } = useQuery({
    queryKey: ["orders"], // Giúp cache dữ liệu
    queryFn: () => ordersApi.getAllOrders(selectedStatus), // ✅ Không cần async wrapper nữa
    refetchOnWindowFocus: false,
  });

  const { data: orderDetail } = useQuery({
    queryKey: ["orderDetail", selectedOrderID], // Giúp cache dữ liệu
    queryFn: () => ordersApi.getOrderByID(selectedOrderID), // ✅ Không cần async wrapper nữa
    enabled: !!selectedOrderID, // Chỉ gọi khi có selectedOrderID
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (orderDetail) {
      console.log("orderDetail", orderDetail);
      setSelectedOrder(orderDetail);
    }
  }, [orderDetail]); // Chạy lại khi orderDetail thay đổi

  // Đẩy dữ liệu vào Redux khi ordersData thay đổi
  useEffect(() => {
    if (ordersData) {
      dispatch({
        type: GET_ALL_ORDERS,
        payload: ordersData, // Truyền dữ liệu vào Redux
      });
    }
  }, [ordersData, dispatch]);

  console.log("selectedOrder", selectedOrder);

  useEffect(() => {
    refetch();
  }, [selectedStatus]); // ✅ Gọi lại API khi selectedStatus thay đổi

  // useEffect(() => {
  //   dispatch(fetchAllOrders()); // 🔥 Truyền dispatch vào
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchAllOrdersByStoreID(2));
  // }, []);

  // Khi đã có dữ liệu, hiển thị sản phẩm

  const showOrderDetails = async (orderID) => {
    try {
      console.log("ID nè ku", orderID);

      setSelectedOrderID(orderID);
      if (orderDetail) {
        console.log("set nè ku", orderDetail);

        setSelectedOrder(orderDetail);
      }

      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleAcceptOrder = (orderID) => {
    dispatch(acceptOrder(orderID))
      .then(() => {
        Swal.fire("Thành công!", "Đơn hàng đã được chấp nhận.", "success");
        dispatch(fetchAllOrdersByStoreID(storeID));
      })
      .catch((error) => {
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi chấp nhận đơn hàng.", "error");
      });
  };

  const handleCompleteOrder = (orderID) => {
    dispatch(completedOrder(orderID))
      .then(() => {
        Swal.fire("Thành công!", "Đơn hàng đã được hoàn tất.", "success");
        dispatch(fetchAllOrdersByStoreID(storeID));
      })
      .catch((error) => {
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi hoàn tất đơn hàng.", "error");
      });
  };

  const handleRejectOrder = (orderID) => {
    Swal.fire({
      title: "Nhập lý do từ chối",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        return dispatch(rejectOrder(orderID, note))
          .then(() => {
            Swal.fire("Thành công!", "Đơn hàng đã bị từ chối.", "success");
            dispatch(fetchAllOrdersByStoreID(storeID));
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([null, null]);
    } else {
      setDateRange(dates);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderID",
      render: (orderId) => (
        <Button type="link" onClick={() => showOrderDetails(orderId)}>
          {orderId}
        </Button>
      ),
    },
    {
      title: "Tên khách hàngg",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => `(+84) ${phone}`,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
          return "N/A";
        }

        const [year, month, day] = dateArray; // Lấy năm, tháng, ngày từ mảng
        return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
      },
      sorter: (a, b) =>
        new Date(a.orderDate[0], a.orderDate[1] - 1, a.orderDate[2]) -
        new Date(b.orderDate[0], b.orderDate[1] - 1, b.orderDate[2]),
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "deliveryDateTime",
      key: "deliveryDateTime",
      render: (date) => {
        return date ? moment.utc(date).format("DD/MM/YYYY HH:mm:ss") : "N/A";
      },
      sorter: (a, b) => new Date(a.deliveryDateTime) - new Date(b.deliveryDateTime),
    },
    {
      title: "Tổng giá trị đơn hàng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        price != null ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price) : "N/A",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const normalizedStatus = status.toLowerCase(); // Chuyển thành chữ thường

        let color = "";
        let label = "";

        switch (normalizedStatus) {
          case "pending":
            color = "orange";
            label = "Chờ xác nhận";
            break;
          case "processing":
            color = "blue";
            label = "Đang xử lý";
            break;
          case "shipped":
            color = "purple";
            label = "Đang giao hàng";
            break;
          case "delivered":
            color = "green";
            label = "Đã giao hàng";
            break;
          case "cancelled":
            color = "red";
            label = "Đã hủy";
            break;
          default:
            color = "gray";
            label = "Không xác định";
        }

        return <span style={{ color: color, fontWeight: "bold" }}>{label}</span>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center", // Căn giữa nội dung trong cột
      render: (_, record) => {
        const { status, orderId } = record;
        console.log("status", status);

        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="link"
              onClick={() => handleAcceptOrder(orderId)}
              disabled={String(status).toLowerCase() !== Istatus.processing}
            >
              Chấp nhận
            </Button>

            <Button
              type="link"
              danger
              onClick={() => handleRejectOrder(orderId)}
              disabled={String(status).toLowerCase() !== Istatus.cancelled}
            >
              Từ chối
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createAt);
    const [start, end] = dateRange;
    return (
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      selectedStatus === "" ||
      order.status === selectedStatus ||
      !start ||
      !end ||
      (orderDate >= start && orderDate <= end)
    );
  });

  const statuses = [...new Set(orders.map((order) => order.status))];

  const customLocale = {
    triggerDesc: "Nhấn để sắp xếp giảm dần",
    triggerAsc: "Nhấn để sắp xếp tăng dần",
    cancelSort: "Nhấn để hủy sắp xếp",
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="Không tìm thấy đơn hàng" />,
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Đơn hàng</h1>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Select
          value={selectedStatus}
          style={{ width: 200, borderColor: "#1fe879" }}
          onChange={(value) => setSelectedStatus(value)}
        >
          <Option value="">Tất cả trạng thái</Option>
          {Array.from(new Set(orders.map((order) => order.status))) // Lọc trạng thái duy nhất
            .map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
        </Select>

        <RangePicker
          style={{ width: 300, borderColor: "#1fe879" }}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          locale={{
            ...locale,
            lang: {
              ...locale.lang,
              rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
            },
          }}
        />
      </div>
      <Input
        placeholder="Tìm tên khách hàng, số điện thoại"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", borderColor: "#1fe879" }}
        suffix={<SearchOutlined style={{ fontSize: "18px", color: "#bfbfbf" }} />}
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="orderID"
        locale={customLocale}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Thông tin chi tiết đơn hàng"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {selectedOrder ? (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã đơn hàng">{selectedOrder.orderId}</Descriptions.Item>
              <Descriptions.Item label="Giá">
                {selectedOrder?.totalPrice?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{selectedOrder.status}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{selectedOrder.note || "Không có ghi chú"}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.shippingAddress}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao hàng">
                {selectedOrder?.deliveryDateTime
                  ? moment.utc(selectedOrder.deliveryDateTime).format("DD/MM/YYYY HH:mm:ss")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">{selectedOrder.userName}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">(+84) {selectedOrder.phone}</Descriptions.Item>
            </Descriptions>
            <h3 style={{ marginTop: "20px" }}>Thông tin sản phẩm</h3>
            {selectedOrder && selectedOrder.orderItems && (
              <Descriptions bordered column={1}>
                {selectedOrder.orderItems.map((detail) => (
                  <React.Fragment key={detail.orderItemId}>
                    <Descriptions.Item label="Tên sản phẩm">{detail.bouquetName}</Descriptions.Item>
                    <Descriptions.Item label="Mã sản phẩm">{detail.orderItemId}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{detail.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Tổng giá">
                      {" "}
                      {detail?.subTotal?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Descriptions.Item>
                  </React.Fragment>
                ))}
              </Descriptions>
            )}
          </>
        ) : (
          <p>Đang tải...</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;
