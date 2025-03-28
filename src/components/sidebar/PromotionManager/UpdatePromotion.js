import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updatePromotion, getPromotionById } from "../../../redux/actions/promotionActions";
import Swal from "sweetalert2";
import moment from "moment";

const UpdatePromotion = ({ promotionID, visible, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const selectedPromotion = useSelector((state) => state.promotionData.selectedPromotion);
  const state = useSelector((state) => state);
  console.log("state", state);
  console.log("promotionID", promotionID);
  useEffect(() => {
    if (promotionID) {
      dispatch(getPromotionById(promotionID));
    }
  }, [dispatch, promotionID]);

  useEffect(() => {
    if (selectedPromotion) {
      form.setFieldsValue({
        code: selectedPromotion.code,
        active: selectedPromotion.active,
        discountPercentage: selectedPromotion.discountPercentage,

        validFrom: selectedPromotion.validFrom
          ? moment(new Date(selectedPromotion.validFrom)).format("YYYY-MM-DD")
          : null,

        validTo: selectedPromotion.validTo ? moment(new Date(selectedPromotion.validTo)).format("YYYY-MM-DD") : null,
      });
    }
  }, [selectedPromotion, form]);

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      dispatch(updatePromotion(promotionID, values))
        .then(() => {
          Swal.fire("Cập nhật thành công!", "Khuyến mãi đã được cập nhật.", "success");
          onClose();
        })
        .catch((error) => {
          Swal.fire("Lỗi", "Cập nhật khuyến mãi thất bại. Vui lòng thử lại.", "error");
        });
    });
  };

  return (
    <Modal
      title="Cập nhật khuyến mãi"
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
        <Form.Item
          name="code"
          label="Tên khuyến mãi"
          rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi" }]}
        >
          <Input placeholder="Nhập tên khuyến mãi" />
        </Form.Item>

        {/* <Form.Item name="id" label="Mã khuyến mãi" rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}>
          <Input placeholder="Nhập mã khuyến mãi" />
        </Form.Item> */}

        <Form.Item
          name="active"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          initialValue={selectedPromotion?.active} // Giá trị ban đầu
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value={true}>Hoạt động</Select.Option>
            <Select.Option value={false}>Chưa hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="Giảm giá (%)"
          rules={[{ required: true, message: "Vui lòng nhập phần trăm giảm giá" }]}
        >
          <Input placeholder="Nhập phần trăm giảm giá" type="number" />
        </Form.Item>

        <Form.Item
          name="validFrom"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu" }]}
        >
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="validTo"
          label="Ngày kết thúc"
          rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc" }]}
        >
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePromotion;
