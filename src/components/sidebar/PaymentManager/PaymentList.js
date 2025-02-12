import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentByStore } from "../../../redux/actions/paymentActions";
import { fetchOrderById } from "../../../redux/actions/orderActions";
import { Button, Input, Select, Table, Empty, Image, Modal, Descriptions, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import locale from 'antd/es/date-picker/locale/vi_VN'; 
import moment from 'moment-timezone';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PaymentList = () => {
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.paymentData.payments) || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const storeID = localStorage.getItem("storeID");

    useEffect(() => {
        dispatch(fetchPaymentByStore(storeID));
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

    const handleDateChange = (dates) => {
        if (!dates || dates.length === 0) {
            setDateRange([null, null]);
        } else {
            setDateRange(dates);
        }
    };

    const columns = [
        {
            title: "Mã thanh toán",
            dataIndex: "paymentID",
            key: "paymentID",
            sorter: (a, b) => a.paymentID - b.paymentID,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "orderID",
            key: "orderID",
            sorter: (a, b) => a.orderID - b.orderID,
            render: (orderID) => (
                <Button type="link" onClick={() => showOrderDetails(orderID)}>
                    {orderID}
                </Button>
            ),
        },
        {
            title: "Cửa hàng",
            dataIndex: "storeName",
            key: "storeName",
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "method",
            key: "method",
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
            key: "bankName",
            render: (text) => text || "Chưa cập nhật",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) =>
                price != null ? `${price.toLocaleString()} VNĐ` : "N/A",
            sorter: (a, b) => a.totalPrice - b.totalPrice,
        },
        {
            title: "Ảnh thanh toán",
            dataIndex: "paymentImage",
            key: "paymentImage",
            align: "center",
            render: (image) =>
                image ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Image
                            src={image}
                            alt="Payment proof"
                            style={{ width: 50, height: 50, objectFit: "cover" }}
                            preview={{
                                maskClassName: "customize-mask",
                                mask: <div className="text-white">Xem</div>,
                            }}
                        />
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>Chưa có ảnh</div>
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status) => (
                <span
                    className={`px-2 py-1 rounded ${status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {status ? "Đã thanh toán" : "Đang chờ xác thực"}
                </span>
            ),
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "paymentDate",
            key: "paymentDate",
            render: (date) =>
                date ? new Date(date).toLocaleString() : "Đang chờ xác thực",
            sorter: (a, b) => {
                if (!a.paymentDate) return -1;
                if (!b.paymentDate) return 1;
                return new Date(a.paymentDate) - new Date(b.paymentDate);
            },
        },
        {
            title: "Ghi chú GD",
            dataIndex: "note",
            key: "note",
            render: (note) => note || "Không có ghi chú",
        },
    ];

    const filteredPayments = payments.filter(
        (payment) => {
            const paymentDate = new Date(payment.paymentDate);
            const [start, end] = dateRange;
            return (
                (payment.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.bankName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedStatus === "" || payment.paymentStatus === (selectedStatus === "true")) &&
                (selectedBank === "" || payment.bankName === selectedBank) &&
                (!start || !end || (paymentDate >= start && paymentDate <= end))
            );
        }
    );

    const customLocale = {
        triggerDesc: "Nhấn để sắp xếp giảm dần",
        triggerAsc: "Nhấn để sắp xếp tăng dần",
        cancelSort: "Nhấn để hủy sắp xếp",
        emptyText: (
            <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="Không tìm thấy thanh toán"
            />
        ),
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Danh sách giao dịch</h1>
            <div
                style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
            >
                <Select
                    defaultValue=""
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedStatus(value)}
                    className="border-pink-500"
                >
                    <Option value="">Tất cả trạng thái</Option>
                    <Option value="true">Đã thanh toán</Option>
                    <Option value="false">Đang chờ xác thực</Option>
                </Select>
                <Select
                    defaultValue=""
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedBank(value)}
                    className="border-pink-500"
                >
                    <Option value="">Tất cả ngân hàng</Option>
                    <Option value="MOMO">MOMO</Option>
                    <Option value="TPBANK">TPBANK</Option>
                </Select>
                <RangePicker
                    style={{ width: 300, borderColor: '#F56285' }}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    locale={{
                        ...locale,
                        lang: {
                            ...locale.lang,
                            rangePlaceholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
                        },
                    }}
                />
            </div>
            <Input
                placeholder="Tìm kiếm theo tên cửa hàng hoặc ngân hàng"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", borderColor: "#F56285" }}
                suffix={<SearchOutlined className="text-lg text-gray-400" />}
            />
            <Table
                columns={columns}
                dataSource={filteredPayments}
                rowKey="paymentID"
                locale={customLocale}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} thanh toán`,
                }}
            />
            <Modal
                title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Thông tin chi tiết đơn hàng</span>}
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
                            <Descriptions.Item label="Mã đơn hàng">{selectedOrder.orderID}</Descriptions.Item>
                            <Descriptions.Item label="Giá">{selectedOrder.oderPrice.toLocaleString()} VNĐ</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{selectedOrder.orderStatus}</Descriptions.Item>
                            <Descriptions.Item label="Ghi chú">{selectedOrder.note || "Không có ghi chú"}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.deliveryAddress}</Descriptions.Item>
                            <Descriptions.Item label="Ngày giao hàng">
                                {selectedOrder?.deliveryDateTime
                                    ? moment.utc(selectedOrder.deliveryDateTime).format('DD/MM/YYYY HH:mm:ss')
                                    : 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên khách hàng">{selectedOrder.accountName}</Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">(+84) {selectedOrder.phone}</Descriptions.Item>
                        </Descriptions>
                        <h3 style={{ marginTop: "20px", fontSize: '24px', fontWeight: 'bold' }}>Thông tin sản phẩm</h3>
                        <Descriptions bordered column={1}>
                            {selectedOrder.orderDetails.map((detail) => (
                                <React.Fragment key={detail.orderDetailID}>
                                    <Descriptions.Item label="Tên sản phẩm">{detail.productName}</Descriptions.Item>
                                    <Descriptions.Item label="Mã sản phẩm">{detail.productID}</Descriptions.Item>
                                    <Descriptions.Item label="Số lượng">{detail.quantity}</Descriptions.Item>
                                    <Descriptions.Item label="Tổng giá">{detail.productTotalPrice.toLocaleString()} VNĐ</Descriptions.Item>
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

export default PaymentList;