import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updatePromotion, getPromotionById } from "../../../redux/actions/promotionActions";
import Swal from "sweetalert2";
import moment from "moment";
import { useQuery } from "react-query";
import { userApi } from "../../../apis/users/userMutation";

const roleMapping = {
  admin: { label: "Quản trị viên", color: "red" },
  manager: { label: "Quản lý", color: "red" },
  shipper: { label: "Người giao hàng", color: "#B8860B" },
  customer: { label: "Khách hàng", color: "green" },
};
const EditRole = ({ userID, visible, onClose, refetch }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const state = useSelector((state) => state);
  console.log("state", state);
  console.log("promotionID", userID);
  // useEffect(() => {
  //   if (promotionID) {
  //     dispatch(getPromotionById(promotionID));
  //   }
  // }, [dispatch, promotionID]);

  const { data: userInfor } = useQuery({
    queryKey: ["user", !!userID], // Giúp cache dữ liệu
    queryFn: () => userApi.getUserByID(userID), // ✅ Không cần async wrapper nữa
    refetchOnWindowFocus: false,
  });

  const selectedPromotion = userInfor;

  useEffect(() => {
    if (selectedPromotion) {
      form.setFieldsValue({
        // name: selectedPromotion.name,
        // address: selectedPromotion.address,
        // email: selectedPromotion.email,
        // phone: selectedPromotion.phone,
        // loyaltyPoints: selectedPromotion.loyaltyPoints,
        accountStatus: selectedPromotion.accountStatus,
        // role: selectedPromotion.role,
        // gender: selectedPromotion.gender,
      });
    }
  }, [selectedPromotion, form]);

  const handleUpdate = () => {
    const formData = form.getFieldsValue(); // Lấy dữ liệu từ Ant Design Form

    userApi
      .updateRole({ id: userID, role: formData.role })
      .then(() => {
        Swal.fire("Cập nhật thành công!", "Vai trò đã được cập nhật.", "success");
        refetch();
        onClose();
      })
      .catch((error) => {
        Swal.fire("Lỗi", "Cập nhật vai trò thất bại. Vui lòng thử lại.", "error");
      });
  };

  return (
    <Modal
      title="Cập nhật trạng thái"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleUpdate}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* <Form.Item
          name="name"
          label="Tên người dùng"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
        >
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Số điện thoại" }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="loyaltyPoints"
          label="Điểm trung thành"
          rules={[{ required: true, message: "Vui lòng nhập điểm trung thành" }]}
        >
          <Input placeholder="Nhập địa chỉ" type="number" />
        </Form.Item>
        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
          <Select placeholder="Chọn vai trò">
            {Object.entries(roleMapping).map(([key, { label, color }]) => (
              <Select.Option key={key} value={String(key).toUpperCase()}>
                <span style={{ color, fontWeight: "bold" }}>{label}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="gender" label="gender" rules={[{ required: true, message: "Vui lòng nhập giới tínhtính" }]}>
          <Input placeholder="Nhập giới tính" />
        </Form.Item> */}
        {/* 
        <Form.Item
          name="loyaltyPoints"
          label="Điểm trung thành"
          rules={[{ required: true, message: "Vui lòng nhập điểm trung thành" }]}
        >
          <Input placeholder="Nhập địa chỉ" type="number" />
        </Form.Item> */}

        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
          <Select placeholder="Chọn vai trò">
            {Object.entries(roleMapping).map(([key, { label, color }]) => (
              <Select.Option key={key} value={String(key).toUpperCase()}>
                <span style={{ color, fontWeight: "bold" }}>{label}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item
          name="accountStatus"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          initialValue={selectedPromotion?.accountStatus} // Giá trị ban đầu
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="true">
              {" "}
              <span style={{ color: "green", fontWeight: "bold" }}>Hoạt động</span>
            </Select.Option>
            <Select.Option value="false">
              <span style={{ color: "red", fontWeight: "bold" }}>Đình chỉ</span>
            </Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default EditRole;
