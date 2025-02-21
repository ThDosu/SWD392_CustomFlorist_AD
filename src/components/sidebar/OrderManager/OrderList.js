import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersByStoreID,
  acceptOrder,
  completedOrder,
  rejectOrder,
  fetchOrderById,
} from "../../../redux/actions/orderActions";
import { Button, Input, Select, Table, Empty, Modal, Descriptions, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import moment from "moment-timezone";
import locale from "antd/es/date-picker/locale/vi_VN";

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

  const storeID = localStorage.getItem("storeID");

  useEffect(() => {
    dispatch(fetchAllOrdersByStoreID(storeID));
  }, [dispatch, storeID]);

  const showOrderDetails = async (orderID) => {
    try {
      const order = await dispatch(fetchOrderById(orderID));
      setSelectedOrder(order);
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
      dataIndex: "orderID",
      key: "orderID",
      render: (orderID) => (
        <Button type="link" onClick={() => showOrderDetails(orderID)}>
          {orderID}
        </Button>
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => `(+84) ${phone}`,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => {
        return date ? moment.utc(date).format("DD/MM/YYYY HH:mm:ss") : "N/A";
      },
      sorter: (a, b) => new Date(a.createAt) - new Date(b.createAt),
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
      dataIndex: "oderPrice",
      key: "oderPrice",
      render: (price) => (price != null ? `${price.toFixed(2)} VNĐ` : "N/A"),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const { orderStatus, orderID } = record;
        return (
          <>
            <Button
              type="link"
              onClick={() => handleAcceptOrder(orderID)}
              disabled={orderStatus !== "Đã thanh toán" && orderStatus !== "Đã hủy"}
            >
              Chấp nhận
            </Button>
            <Button
              type="link"
              onClick={() => handleCompleteOrder(orderID)}
              disabled={orderStatus !== "Đang thực hiện"}
            >
              Hoàn tất
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleRejectOrder(orderID)}
              disabled={orderStatus === "Đã hoàn tất" || orderStatus === "Đang thực hiện"}
            >
              Từ chối
            </Button>
          </>
        );
      },
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createAt);
    const [start, end] = dateRange;
    return (
      order.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatus === "" || order.orderStatus === selectedStatus) &&
      (!start || !end || (orderDate >= start && orderDate <= end))
    );
  });

  const statuses = [...new Set(orders.map((order) => order.orderStatus))];

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
          defaultValue=""
          style={{ width: 200, borderColor: "#1fe879" }}
          onChange={(value) => setSelectedStatus(value)}
        >
          <Option value="">Tất cả trạng thái</Option>
          {statuses.map((status) => (
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
              <Descriptions.Item label="Mã đơn hàng">{selectedOrder.orderID}</Descriptions.Item>
              <Descriptions.Item label="Giá">{selectedOrder.oderPrice.toLocaleString()} VNĐ</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{selectedOrder.orderStatus}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{selectedOrder.note || "Không có ghi chú"}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.deliveryAddress}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao hàng">
                {selectedOrder?.deliveryDateTime
                  ? moment.utc(selectedOrder.deliveryDateTime).format("DD/MM/YYYY HH:mm:ss")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">{selectedOrder.accountName}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">(+84) {selectedOrder.phone}</Descriptions.Item>
            </Descriptions>
            <h3 style={{ marginTop: "20px" }}>Thông tin sản phẩm</h3>
            <Descriptions bordered column={1}>
              {selectedOrder.orderDetails.map((detail) => (
                <React.Fragment key={detail.orderDetailID}>
                  <Descriptions.Item label="Tên sản phẩm">{detail.productName}</Descriptions.Item>
                  <Descriptions.Item label="Mã sản phẩm">{detail.productID}</Descriptions.Item>
                  <Descriptions.Item label="Số lượng">{detail.quantity}</Descriptions.Item>
                  <Descriptions.Item label="Tổng giá">
                    {detail.productTotalPrice.toLocaleString()} VNĐ
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          </>
        ) : (
          <p>Đang tải...</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;
