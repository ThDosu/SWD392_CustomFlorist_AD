import React, { useState } from "react";
import { Form, Input, Button, Select, Upload, InputNumber, Switch, message, Card, Row, Col, Typography } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../redux/actions/productActions";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const AddProduct = () => {
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState([]);
  const [hasSizes, setHasSizes] = useState(false); // Trạng thái để theo dõi xem có kích thước nào được thêm hay không

  const handleUpload = (info) => {
    if (info.file.status === "done") {
      setImageFiles((prevFiles) => [...prevFiles, info.file.originFileObj]);
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed`);
    }
  };

  const onFinish = (values) => {
    const sizes = values.sizes || [];

    // Nếu có size, kiểm tra tổng số lượng size so với tổng số lượng sản phẩm
    if (sizes.length > 0) {
      const totalSizeQuantity = sizes.reduce((total, size) => total + (size.sizeQuantity || 0), 0);
      if (totalSizeQuantity !== values.quantity) {
        message.error("Tổng số lượng size không bằng tổng số lượng sản phẩm!");
        return;
      }
    }

    const productRequest = {
      discount: values.discount || 0,
      description: values.description,
      colour: values.colour,
      productName: values.productName,
      featured: values.featured,
      quantity: values.quantity,
      categoryName: values.categoryName,
      storeID: localStorage.getItem("storeID"),
      productStatus: values.productStatus,
      price: hasSizes ? null : values.price, // Nếu có kích thước, giá sản phẩm sẽ là null
      sizes: sizes,
    };

    dispatch(createProduct(productRequest, imageFiles))
      .then(() => {
        message.success("Product created successfully!");
      })
      .catch((error) => {
        message.error("Failed to create product: " + error.message);
      });
  };

  return (
    <Card
      className="add-product-container"
      style={{ maxWidth: 1600, margin: "0 auto", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 30, color: "#F56285" }}>
        Thêm Sản Phẩm
      </Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ featured: false, productStatus: true, discount: 0 }}
        className="add-product-form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="productName"
              label="Tên Sản Phẩm"
              rules={[{ required: true, message: "Làm ơn nhập tên sản phẩm!" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="categoryName"
              label="Loại Sản Phẩm"
              rules={[{ required: true, message: "Làm ơn chọn loại sản phẩm!" }]}
            >
              <Select placeholder="Select category">
                <Option value="hoa">Hoa</Option>
                <Option value="quà">Quà</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="colour"
              label="Sản phẩm bao gồm: "
              rules={[{ required: true, message: "Vui lòng nhập sản phẩm bao gồm!" }]}
            >
              <Input placeholder="Hoa hồng, nước hoa,..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Giá tổng"
              rules={[{ required: !hasSizes, message: "Vui lòng nhập giá tổng!" }]}
            >
              <InputNumber min={0} placeholder="Nhập giá tổng" style={{ width: "100%" }} disabled={hasSizes} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng tổng!" }]}
            >
              <InputNumber min={0} placeholder="Nhập số lượng tổng" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="discount" label="Discount (%)">
          <InputNumber min={0} max={100} placeholder="Enter discount percentage" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="sizes" label="Sizes">
          <Form.List name="sizes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Card key={key} style={{ marginBottom: 8, background: "#f0f2f5" }}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "text"]}
                          fieldKey={[fieldKey, "text"]}
                          rules={[{ required: true, message: "Size text required" }]}
                        >
                          <Input placeholder="Kích thước" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          fieldKey={[fieldKey, "price"]}
                          rules={[{ required: true, message: "Price required" }]}
                        >
                          <InputNumber min={0} placeholder="Giá kích thước" style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "sizeQuantity"]}
                          fieldKey={[fieldKey, "sizeQuantity"]}
                          rules={[{ required: true, message: "Quantity required" }]}
                        >
                          <InputNumber min={0} placeholder="Số lượng" style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Button
                          type="link"
                          danger
                          onClick={() => {
                            remove(name);
                            if (fields.length === 1) {
                              setHasSizes(false); // Nếu không còn kích thước nào, cho phép nhập giá sản phẩm
                            }
                          }}
                        >
                          Loại bỏ
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                      setHasSizes(true); // Khi thêm kích thước, vô hiệu hóa trường nhập giá sản phẩm
                      message.info("Giá sản phẩm sẽ được tính dựa trên các kích thước đã thêm.");
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm Kích Thước
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="productStatus" label="Trạng Thái của Sản Phẩm" valuePropName="checked">
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="featured" label="Đề Xuất" valuePropName="checked">
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Hình ảnh sản phẩm">
          <Upload
            name="imageFiles"
            listType="picture-card"
            multiple={true}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => onSuccess("ok"), 0);
            }}
            onChange={handleUpload}
            accept="image/*"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Đăng hình</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="custom-button"
            style={{ background: "#000000", borderColor: "#1fe879" }}
          >
            Thêm vào danh sách
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddProduct;
