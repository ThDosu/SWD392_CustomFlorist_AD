import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayment, fetchPaymentByStore } from "../../../redux/actions/paymentActions";
import { fetchOrderById } from "../../../redux/actions/orderActions";
import { Button, Input, Select, Table, Empty, Image, Modal, Descriptions, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment-timezone";

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusMapping = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  delivered: "Đã giao hàng",
  shipped: "Đang giao hàng",
  cancelled: "Đã hủy",
};

const PaymentList = () => {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.paymentData.payments) || [];

  console.log("payments", payments);

  const state = useSelector((state) => state) || [];
  console.log("state", state);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPayment());
  }, [dispatch]);

  const showOrderDetails = async (orderID) => {
    try {
      const order = await dispatch(fetchOrderById(orderID));
      console.log("order", order);

      setSelectedOrder(order);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([null, null]);
    } else {
      setDateRange(dates);
    }
  };

  const columns = [
    // {
    //   title: "Mã đơn hàng",
    //   dataIndex: "order_id",
    //   key: "order_id",
    //   sorter: (a, b) => a.orderID - b.orderID,
    //   render: (orderID) => (
    //     <Button type="link" onClick={() => showOrderDetails(orderID)}>
    //       {orderID}
    //     </Button>
    //   ),
    // },

    {
      title: "Mã thanh toán",
      dataIndex: "transactionCode",
      key: "transactionCode",
      align: "center",
      render: (text) => text,
    },

    // {
    //   title: "Cửa hàng",
    //   dataIndex: "storeName",
    //   key: "storeName",
    // },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
    },
    // {
    //   title: "Ngân hàng",
    //   dataIndex: "bankName",
    //   key: "bankName",
    //   render: (text) => text || "Chưa cập nhật",
    // },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (price) => (price != null ? `${price.toLocaleString()} VNĐ` : "N/A"),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    // {
    //   title: "Ảnh thanh toán",
    //   dataIndex: "paymentImage",
    //   key: "paymentImage",
    //   align: "center",
    //   render: (image) =>
    //     image ? (
    //       <div style={{ display: "flex", justifyContent: "center" }}>
    //         <Image
    //           src={image}
    //           alt="Payment proof"
    //           style={{ width: 50, height: 50, objectFit: "cover" }}
    //           preview={{
    //             maskClassName: "customize-mask",
    //             mask: <div className="text-white">Xem</div>,
    //           }}
    //         />
    //       </div>
    //     ) : (
    //       <div style={{ textAlign: "center" }}>Chưa có ảnh</div>
    //     ),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const normalizedStatus = String(status).toLowerCase(); // Đảm bảo luôn là chuỗi

        let color = "";
        let label = "";

        switch (normalizedStatus) {
          case "pending":
            color = "orange";
            label = "Chờ thanh toán";
            break;

          case "completed":
            color = "green";
            label = "Đã thanh toán";
            break;

          case "failed":
            color = "red";
            label = "Thanh toán thất bại";
            break;

          default:
            color = "gray";
            label = "Không xác định";
        }

        return <span style={{ color: color, fontWeight: "bold" }}>{label}</span>;
      },
    },

    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (dateArray) => {
        if (!Array.isArray(dateArray) || dateArray.length < 5) return "Đang chờ xác thực";

        const [year, month, day, hour, minute] = dateArray;
        const formattedDate = new Date(year, month - 1, day, hour, minute); // Month starts from 0 in JS

        return formattedDate.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
    // {
    //   title: "Ghi chú GD",
    //   dataIndex: "note",
    //   key: "note",
    //   render: (note) => note || "Không có ghi chú",
    // },
  ];

  const filteredPayments = payments.filter((payment) => {
    if (!Array.isArray(payment.paymentDate) || payment.paymentDate.length < 5) {
      return false; // Bỏ qua nếu paymentDate không hợp lệ
    }

    // Chuyển Payment Date thành đối tượng Date
    const [year, month, day, hour, minute] = payment.paymentDate;
    const paymentDate = new Date(year, month - 1, day, hour, minute); // Month bắt đầu từ 0

    const [start, end] = dateRange;
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    return (
      (!searchTerm || payment.transactionCode?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedStatus === "" || String(payment.status).toLowerCase() === selectedStatus) &&
      (!startDate || !endDate || (paymentDate >= startDate && paymentDate <= endDate))
    );
  });

  const customLocale = {
    triggerDesc: "Nhấn để sắp xếp giảm dần",
    triggerAsc: "Nhấn để sắp xếp tăng dần",
    cancelSort: "Nhấn để hủy sắp xếp",
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="Không tìm thấy thanh toán" />,
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách giao dịch</h1>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Select
          defaultValue=""
          style={{ width: 200 }}
          onChange={(value) => setSelectedStatus(value)}
          className="border-green-500"
        >
          <Option value="">Tất cả trạng thái</Option>
          <Option value="completed">Đã thanh toán</Option>
          <Option value="pending">Chờ thanh toán</Option>
          <Option value="failed">Thanh toán thất bại</Option>
        </Select>
        {/* <Select
          defaultValue=""
          style={{ width: 200 }}
          onChange={(value) => setSelectedBank(value)}
          className="border-pink-500"
        >
          <Option value="">Tất cả ngân hàng</Option>
          <Option value="MOMO">MOMO</Option>
          <Option value="TPBANK">TPBANK</Option>
        </Select> */}
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
        placeholder="Tìm kiếm theo mã giao dịch"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", borderColor: "#1fe879" }}
        suffix={<SearchOutlined className="text-lg text-gray-400" />}
      />
      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey="paymentID"
        locale={customLocale}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thanh toán`,
        }}
      />
      <Modal
        title={<span style={{ fontSize: "24px", fontWeight: "bold" }}>Thông tin chi tiết đơn hàng</span>}
        visible={isModalVisible}
        onCancel={handleModalClose}
        style={{ top: 20 }}
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
              <Descriptions.Item label="Trạng thái">
                {" "}
                {statusMapping[String(selectedOrder.status).toLowerCase()] || "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{selectedOrder.note || "Không có ghi chú"}</Descriptions.Item>
              <Descriptions.Item label="Lý do">{selectedOrder.reason || "Không có lý do"}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.shippingAddress}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao hàng">
                {selectedOrder?.deliveryHistories?.[0]?.statusHistories?.length
                  ? (() => {
                      // Lấy danh sách statusHistories
                      const histories = selectedOrder.deliveryHistories[0].statusHistories;

                      // Tìm `changedAt` mới nhất
                      const latestHistory = histories.reduce((latest, current) => {
                        const latestDate = new Date(
                          latest.changedAt[0],
                          latest.changedAt[1] - 1,
                          latest.changedAt[2],
                          latest.changedAt[3],
                          latest.changedAt[4]
                        );

                        const currentDate = new Date(
                          current.changedAt[0],
                          current.changedAt[1] - 1,
                          current.changedAt[2],
                          current.changedAt[3],
                          current.changedAt[4]
                        );

                        return currentDate > latestDate ? current : latest;
                      });

                      // Định dạng lại thời gian mới nhất
                      return moment
                        .utc(
                          new Date(
                            latestHistory.changedAt[0],
                            latestHistory.changedAt[1] - 1,
                            latestHistory.changedAt[2],
                            latestHistory.changedAt[3],
                            latestHistory.changedAt[4]
                          )
                        )
                        .format("DD/MM/YYYY");
                    })()
                  : "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Tên khách hàng">{selectedOrder.userName}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại"> {selectedOrder.phone}</Descriptions.Item>
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

export default PaymentList;
