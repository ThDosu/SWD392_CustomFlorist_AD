/* eslint-disable no-unused-vars */
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, Empty, Input, Modal, Select, Table } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const storeID = localStorage.getItem("storeID");
  const [dateRange, setDateRange] = useState([null, null]);

  const statusMapping = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    delivered: "Đã giao hàng",
    shipped: "Đang giao hàng",
    cancelled: "Đã hủy",
  };

  const { data: ordersData, refetch } = useQuery({
    queryKey: ["orders"], // Giúp cache dữ liệu
    queryFn: () =>
      ordersApi.getAllOrders(
        selectedStatus,
        dateRange[0]?.startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        dateRange[1]?.endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        searchTerm
      ), // ✅ Không cần async wrapper nữa
    refetchOnWindowFocus: false,
  });

  console.log("dateRange", dateRange);

  const { data: orderDetail } = useQuery({
    queryKey: ["orderDetail", selectedOrderID], // Giúp cache dữ liệu
    queryFn: () => ordersApi.getOrderByID(selectedOrderID), // ✅ Không cần async wrapper nữa
    enabled: !!selectedOrderID, // Chỉ gọi khi có selectedOrderID
    refetchOnWindowFocus: false,
  });

  console.log("ordersData", ordersData);

  const updateStatusMutation = useMutation(({ id, status }) => ordersApi.updateStatus({ id, status }));

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
  }, [selectedStatus, dateRange]); // ✅ Gọi lại API khi selectedStatus thay đổi

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
    updateStatusMutation.mutate(
      { id: orderID, status: "SHIPPED" },
      {
        onSuccess: () => {
          Swal.fire("Thành công!", "Đơn hàng đang được vận chuyển.", "success");
          refetch();
        },
        onError: () => {
          Swal.fire("Lỗi!", "Có lỗi xảy ra khi chấp nhận vận chuyển đơn hàng.", "error");
        },
      }
    );
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

  // const handleRejectOrder = (orderID) => {
  //   Swal.fire({
  //     title: "Nhập lý do từ chối",
  //     input: "text",
  //     inputAttributes: {
  //       autocapitalize: "off",
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: "Từ chối",
  //     cancelButtonText: "Hủy",
  //     showLoaderOnConfirm: true,
  //     preConfirm: (note) => {
  //       return dispatch(rejectOrder(orderID, note))
  //         .then(() => {
  //           Swal.fire("Thành công!", "Đơn hàng đã bị từ chối.", "success");
  //           dispatch(fetchAllOrdersByStoreID(storeID));
  //         })
  //         .catch((error) => {
  //           Swal.showValidationMessage(`Request failed: ${error}`);
  //         });
  //     },
  //     allowOutsideClick: () => !Swal.isLoading(),
  //   });
  // };

  const handleRejectOrder = (orderID) => {
    updateStatusMutation.mutate(
      { id: orderID, status: "CANCELLED" },
      {
        onSuccess: () => {
          Swal.fire("Thành công!", "Đơn hàng đã được hủy.", "success");
          refetch();
        },
        onError: () => {
          Swal.fire("Lỗi!", "Có lỗi xảy ra khi hủy đơn hàng.", "error");
        },
      }
    );
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([null, null]);
    } else {
      const [start, end] = dates;
      const adjustedStart = start ? start.startOf("day") : null; // 00:00:00
      const adjustedEnd = end ? end.endOf("day") : null; // 23:59:59

      setDateRange([adjustedStart, adjustedEnd]);
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
      title: "Tên khách hàng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => ` ${phone}`,
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
      dataIndex: "deliveryHistories",
      key: "deliveryHistories",
      render: (deliveryHistories) => {
        console.log("deliveryHistories", deliveryHistories);

        if (!deliveryHistories || deliveryHistories.length === 0) return "N/A";

        // Lấy tất cả statusHistories từ tất cả deliveryHistories
        const allStatusHistories = deliveryHistories.flatMap((delivery) => delivery.statusHistories || []);

        if (allStatusHistories.length === 0) return "N/A";

        // Sắp xếp theo `changedAt` mới nhất
        const latestHistory = allStatusHistories.sort(
          (a, b) => new Date(Date.UTC(...b.changedAt)).getTime() - new Date(Date.UTC(...a.changedAt)).getTime()
        )[0];

        return latestHistory?.changedAt
          ? moment.utc(new Date(Date.UTC(...latestHistory.changedAt))).format("DD/MM/YYYY HH:mm:ss")
          : "N/A";
      },
      sorter: (a, b) => {
        const getLatestChangeAt = (order) => {
          const allHistories = order.deliveryHistories?.flatMap((delivery) => delivery.statusHistories || []) || [];

          if (allHistories.length === 0) return 0;

          return new Date(
            Date.UTC(
              ...allHistories.sort(
                (h1, h2) => new Date(Date.UTC(...h2.changedAt)) - new Date(Date.UTC(...h1.changedAt))
              )[0].changedAt
            )
          ).getTime();
        };

        return getLatestChangeAt(a) - getLatestChangeAt(b);
      },
    },

    {
      title: "Tổng giá trị đơn hàng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) =>
        totalPrice != null
          ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)
          : "N/A",
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
      key: "status",
      align: "center", // Căn giữa nội dung trong cột
      render: (_, record) => {
        const { status, orderId } = record;
        console.log("Record:", record);
        console.log("Status:", record?.status);
        console.log("Reason:", record?.reason);
        const reason = record?.reason ?? "Không có lý do";

        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {String(status).toLowerCase() === Istatus.processing ? (
              <Button
                type="link"
                onClick={() => handleAcceptOrder(orderId)}
                disabled={String(status).toLowerCase() !== Istatus.processing}
              >
                Giao Hàng
              </Button>
            ) : String(status).toLowerCase() === Istatus.cancel ? (
              <span style={{ color: "red", fontWeight: "bold" }}>Đã hủy: {reason || "Không có lý do"}</span>
            ) : null}
          </div>
        );
      },
    },
  ];
  const filteredOrders = orders.filter((order) => {
    const orderDate = Array.isArray(order.createAt)
      ? new Date(Date.UTC(...order.createAt)) // Nếu order.createAt là mảng
      : new Date(order.createAt); // Nếu order.createAt là chuỗi
    const [start, end] = dateRange;

    const matchesSearch = searchTerm ? order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    const matchesStatus = selectedStatus ? String(order.status).toLowerCase() === selectedStatus : true;

    // Kiểm tra xem orderDate có nằm trong khoảng start và end không
    const matchesDate =
      start instanceof Date && end instanceof Date && !isNaN(start) && !isNaN(end)
        ? orderDate.getTime() >= start.getTime() && orderDate.getTime() <= end.getTime()
        : true;

    return matchesSearch && matchesStatus && matchesDate;
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
          {Array.from(new Set(orders.map((order) => String(order.status).toLowerCase()))) // Lọc trạng thái duy nhất
            .map((status) => (
              <Option key={status} value={status}>
                {statusMapping[status] || "Không xác định"}
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
        placeholder="Tìm tên khách hàng"
        onChange={(e) => setSearchTerm(e.target.value.trim())}
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

export default OrderList;
