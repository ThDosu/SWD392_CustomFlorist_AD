import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, InputNumber, Switch, Upload, Button, message, Row, Col, Card, Divider, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { updateProduct, getProductByID, deleteProductImage } from '../../../redux/actions/productActions';

const UpdateProduct = ({ visible, onCancel, productID }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [fileList, setFileList] = useState([]);
    const [deletedFileList, setDeletedFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productID) {
            setLoading(true);
            dispatch(getProductByID(productID))
                .then((product) => {
                    form.setFieldsValue({
                        productName: product.productName,
                        description: product.description,
                        price: product.price,
                        discount: product.discount,
                        quantity: product.quantity,
                        featured: product.featured,
                        productStatus: product.productStatus,
                        colour: product.colour,
                        categoryName: product.categoryName,
                        sizes: product.sizes.map((size, index) => ({
                            text: size.text,
                            price: size.price,
                            sizeQuantity: size.sizeQuantity,
                        })),
                    });
                    setFileList(product.images.map((img, index) => ({
                        uid: img.imageID,
                        name: `image-${index}.png`,
                        status: 'done',
                        url: img.productImage,
                    })));

                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch product:", error);
                    message.error("Failed to load product information");
                    setLoading(false);
                });
        }
    }, [productID, dispatch, form]);

    const handleUpdate = (values) => {
        Swal.fire({
            title: 'Xác nhận cập nhật',
            text: "Bạn có chắc chắn muốn cập nhật sản phẩm này?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);

                // Kiểm tra nếu không còn kích thước
                const sizes = values.sizes && values.sizes.length > 0 ? values.sizes : [];

                // Kiểm tra tổng số lượng các kích thước so với tổng số lượng sản phẩm
                if (sizes.length > 0) {
                    const totalSizeQuantity = sizes.reduce((total, size) => total + (size.sizeQuantity || 0), 0);
                    if (totalSizeQuantity !== values.quantity) {
                        message.error('Tổng số lượng size không bằng tổng số lượng sản phẩm!');
                        setLoading(false);
                        return;
                    }
                }

                // Loại bỏ thuộc tính images khỏi đối tượng values
                const { images, ...productRequest } = values;

                productRequest.sizes = sizes;  // Gán sizes là [] nếu không còn kích thước
                productRequest.categoryName = values.categoryName || form.getFieldValue('categoryName');

                const imageFiles = fileList.filter(file => file.originFileObj).map(file => file.originFileObj);

                dispatch(updateProduct(productID, productRequest, imageFiles))
                    .then(() => {
                        Swal.fire(
                            'Đã cập nhật!',
                            'Sản phẩm đã được cập nhật thành công.',
                            'success'
                        );
                        onCancel();
                    })
                    .catch((error) => {
                        console.error("Failed to update product:", error);
                        Swal.fire(
                            'Lỗi!',
                            'Có lỗi xảy ra khi cập nhật sản phẩm.',
                            'error'
                        );
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleFileChange = ({ fileList: newFileList, file }) => {
        // Kiểm tra nếu file bị xóa (status là "removed")
        if (file.status === 'removed' && file.url) {
            // Lưu trữ ảnh bị xóa tạm thời
            setDeletedFileList([...deletedFileList, file]);

            // Xóa ảnh bằng cách gọi API xóa
            dispatch(deleteProductImage(productID, file.uid))
                .then(() => {
                    message.success('Ảnh đã được xóa thành công');
                })
                .catch((error) => {
                    message.error('Xóa ảnh thất bại');
                    console.error('Delete image failed:', error);
                });
        }

        setFileList(newFileList);
    };

    const handleCancel = () => {
        // Khôi phục lại danh sách ảnh đã bị xóa tạm thời
        setFileList([...fileList, ...deletedFileList]);
        setDeletedFileList([]);
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            title="Cập nhật sản phẩm"
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={1000}
            style={{ top: 20 }} // Điều chỉnh vị trí của modal
            bodyStyle={{ height: '90vh', overflowY: 'auto' }} // Tăng chiều cao modal và điều chỉnh overflow
        >
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Card title="Thông tin cơ bản" bordered={false}>
                            <Form.Item name="productName" label="Tên sản phẩm" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="categoryName" label="Danh mục">
                                <Input />
                            </Form.Item>
                        </Card>
                        <Divider />
                        <Card title="Giá và số lượng" bordered={false}>
                            <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number', min: 0 }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="discount" label="Giảm giá (%)" rules={[{ type: 'number', min: 0, max: 100 }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, type: 'number', min: 0 }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Thông tin bổ sung" bordered={false}>
                            <Form.Item name="colour" label="Màu sắc">
                                <Input />
                            </Form.Item>
                            <Form.Item name="featured" label="Sản phẩm nổi bật" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="productStatus" label="Trạng thái sản phẩm" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Card>
                        <Divider />
                        <Card title="Kích thước sản phẩm" bordered={false}>
                            <Form.List name="sizes">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'text']}
                                                    fieldKey={[fieldKey, 'text']}
                                                    label="Kích thước"
                                                    rules={[{ required: true, message: 'Nhập kích thước!' }]}
                                                >
                                                    <Input placeholder="Nhập kích thước" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    fieldKey={[fieldKey, 'price']}
                                                    label="Giá"
                                                    rules={[{ required: true, message: 'Nhập giá!' }]}
                                                >
                                                    <InputNumber placeholder="Nhập giá" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'sizeQuantity']}
                                                    fieldKey={[fieldKey, 'sizeQuantity']}
                                                    label="Số lượng"
                                                    rules={[{ required: true, message: 'Nhập số lượng!' }]}
                                                >
                                                    <InputNumber placeholder="Nhập số lượng" />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Thêm kích thước
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                        <Divider />
                        <Card title="Hình ảnh sản phẩm" bordered={false}>
                            <Form.Item name="images" label="Hình ảnh">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleFileChange}
                                    beforeUpload={() => false}
                                >
                                    {fileList.length >= 8 ? null : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Tải lên</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateProduct;