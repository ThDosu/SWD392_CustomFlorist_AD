import React, { useEffect, useState } from "react";
import { Card, Button, Empty, Spin, InputNumber, Form, Modal } from "antd";
import { ReloadOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDistanseFeeByStore,
  updateDistanseFee,
  createDistanseFee,
} from "../../../redux/actions/distanseFeeActions";
import Swal from "sweetalert2";
import "./DistanseFee.css"; // Import file CSS tùy chỉnh

const DistanseFeeList = () => {
  const dispatch = useDispatch();
  const { distanseFee, loading } = useSelector((state) => state.distanseFeeData);

  const storeID = localStorage.getItem("storeID");

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchDistanseFeeByStore(storeID));
  }, [dispatch, storeID]);

  const handleReload = () => {
    dispatch(fetchDistanseFeeByStore(storeID));
  };

  const showUpdateModal = () => {
    form.setFieldsValue({
      fee: distanseFee.fee,
      range: distanseFee.range,
    });
    setIsUpdateModalVisible(true);
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleUpdate = (values) => {
    dispatch(updateDistanseFee(storeID, values.fee, values.range))
      .then(() => {
        Swal.fire("Thành công!", "Thông tin phí khoảng cách đã được cập nhật.", "success");
        setIsUpdateModalVisible(false);
        dispatch(fetchDistanseFeeByStore(storeID));
      })
      .catch((error) => {
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật thông tin phí khoảng cách.", "error");
      });
  };

  const handleCreate = (values) => {
    dispatch(createDistanseFee(storeID, values.fee, values.range))
      .then(() => {
        Swal.fire("Thành công!", "Phí khoảng cách đã được tạo.", "success");
        setIsCreateModalVisible(false);
        dispatch(fetchDistanseFeeByStore(storeID));
      })
      .catch((error) => {
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi tạo phí khoảng cách.", "error");
      });
  };

  return (
    <div style={{ padding: "40px", background: "#fff", borderRadius: "12px" }}>
      <h2 style={{ marginBottom: "40px", textAlign: "center", fontSize: "60px" }}>Thông Tin Phí Khoảng Cách</h2>
      <p style={{ textAlign: "center", fontSize: "20px", marginBottom: "32px", marginTop: "20px" }}>
        Phí khoảng cách này được sử dụng để tính toán chi phí vận chuyển cho các đơn hàng. Xin lưu ý rằng việc giao hàng
        sẽ do cửa hàng tự thực hiện và chúng tôi không chịu trách nhiệm quản lý quá trình giao hàng này.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : distanseFee ? (
        <Card
          title={<span style={{ fontSize: "40px", fontWeight: "bold" }}>Shop: {distanseFee.storeName}</span>}
          bordered
          style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", fontSize: "50px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginBottom: "16px" }}>
            <strong>Số tiền:</strong>
            <span>{distanseFee.fee.toLocaleString()} VND</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginBottom: "16px" }}>
            <strong>Khoảng cách:</strong>
            <span>{distanseFee.range} km</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={handleReload}
              style={{ fontSize: "16px", padding: "10px 20px" }}
            >
              Tải lại
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={showUpdateModal}
              style={{ fontSize: "16px", padding: "10px 20px", color: "#f56285" }}
            >
              Cập nhật
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Empty description="No Distance Fee Data" style={{ padding: "60px 0", fontSize: "18px" }} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            style={{
              fontSize: "px",
              padding: "10px 20px",
              marginTop: "24px",
              backgroundColor: "#1a1a1a",
              borderColor: "#1fe879",
            }}
          >
            Thêm phí khoảng cách
          </Button>
        </div>
      )}

      <Modal
        title="Cập nhật thông tin phí khoảng cách"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="fee" label="Số tiền" rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="range"
            label="Khoảng cách (km)"
            rules={[{ required: true, message: "Vui lòng nhập khoảng cách" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="custom-button">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm phí khoảng cách"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item name="fee" label="Số tiền" rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="range"
            label="Khoảng cách (km)"
            rules={[{ required: true, message: "Vui lòng nhập khoảng cách" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="custom-button">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DistanseFeeList;
