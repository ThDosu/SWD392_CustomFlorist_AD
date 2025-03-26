import React from "react";
import { Form, Input, Button, message, Card, DatePicker, InputNumber } from "antd";
import { useDispatch } from "react-redux";
import moment from "moment";
import { createPromotion, getAllPromotions } from "../../../redux/actions/promotionActions";

const AddPromotion = () => {
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const promotionRequest = {
      code: values.promotionName,
      id: values.promotionCode,
      active: true,

      discountPercentage: values.promotionDiscount,
      bouquetId: values.bouquetId,
      validFrom: moment(values.startDate).format("YYYY-MM-DD"),
      validTo: moment(values.endDate).format("YYYY-MM-DD"),
    };

    console.log("promotionRequest", promotionRequest);

    dispatch(createPromotion(promotionRequest))
      .then(() => {
        message.success("Thêm sản phẩm thành công");
      })
      .catch((error) => {
        message.error("Failed to create promotion");
      });
  };

  return (
    <Card
      className="add-promotion-container"
      style={{ maxWidth: 1600, margin: "0 auto", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30, color: "#1fe879" }}>Thêm Khuyến Mãi</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          name="promotionCode"
          label="Mã khuyến mãi"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="promotionName"
          label="Tên khuyến mãi"
          rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="bouquetId" label="Mã bó hoa" rules={[{ required: true, message: "Vui lòng nhập mã!" }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="promotionStatus"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng nhập trạng thái!" }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="promotionDiscount"
          label="Giảm giá (%)"
          rules={[{ required: true, message: "Vui lòng nhập giảm giá!" }]}
        >
          <InputNumber min={0} max={1} step={0.01} />
        </Form.Item>
        {/* <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}>
          <InputNumber min={0} />
        </Form.Item> */}
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Ngày kết thúc"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="custom-button"
            htmlType="submit"
            style={{ backgroundColor: "#1a1a1a", borderColor: "#1fe879" }}
          >
            Tạo Khuyến Mãi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddPromotion;
