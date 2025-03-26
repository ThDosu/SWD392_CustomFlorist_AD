import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  Button,
  message,
  Row,
  Col,
  Card,
  Divider,
  Space,
  Select,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  updateProduct,
  getProductByID,
  deleteProductImage,
  GET_PRODUCTS_BY_ID,
  UPDATE_PRODUCT_SUCCESS,
} from "../../../redux/actions/productActions";
import { categoriesApi } from "../../../apis/categories/categoriesMutation";
import { useQuery } from "react-query";
import { floweriestApi } from "../../../apis/flowers/flowersMutation";
import { uploadImage } from "../../../utils/firebaseString";

const UpdateFlower = ({ visible, onCancel, flowerId, refetch }) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [deletedFileList, setDeletedFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: flowerDetail } = useQuery({
    queryKey: ["flower", flowerId], // Giúp cache dữ liệu
    queryFn: () => floweriestApi.getFlowersById(flowerId), // ✅ Không cần async wrapper nữa
    enabled: !!flowerId, // Chỉ gọi khi có selectedOrderID
    refetchOnWindowFocus: false,
  });

  console.log("flowerId", flowerId);

  console.log("flowerDetail", flowerDetail);

  // useEffect(() => {
  //   if (flowerDetail) {
  //     dispatch({
  //       type: GET_PRODUCTS_BY_ID,

  //       payload: flowerDetail, // Truyền dữ liệu vào Redux
  //     });
  //   }
  // }, [flowerDetail, dispatch, flowerId]);

  useEffect(() => {
    if (flowerDetail) {
      form.setFieldsValue({
        name: flowerDetail.name,
        flowerType: flowerDetail.flowerType,
        color: flowerDetail.color,
        price: flowerDetail.price,
        image: flowerDetail.image,
        isActive: flowerDetail.isActive,
      });
    }
  }, [flowerDetail, form]);

  const handleUpdate = async (values) => {
    let uploadedImageUrl = values.image; // Nếu không có ảnh mới, dùng ảnh cũ
    if (fileList.length > 0) {
      const fileToUpload = fileList[0].originFileObj || fileList[0];

      try {
        uploadedImageUrl = await uploadImage(fileToUpload); // Chờ tải ảnh xong

        console.log("upodateÌmgaÌmga", uploadedImageUrl);
      } catch (error) {
        console.error("Lỗi tải ảnh lên:", error);
      }
    }
    const formData = {
      flowerId: flowerDetail.flowerId,
      name: values.name,
      flowerType: values.flowerType,
      color: values.color,
      price: values.price,
      image: uploadedImageUrl,
      isActive: Boolean(values.isActive),
    };

    Swal.fire({
      title: "Xác nhận cập nhật",
      text: "Bạn có chắc chắn muốn cập nhật sản phẩm này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);

        // // Kiểm tra nếu không còn kích thước
        // const sizes = values.sizes && values.sizes.length > 0 ? values.sizes : [];

        // // Kiểm tra tổng số lượng các kích thước so với tổng số lượng sản phẩm
        // if (sizes.length > 0) {
        //   const totalSizeQuantity = sizes.reduce((total, size) => total + (size.sizeQuantity || 0), 0);
        //   if (totalSizeQuantity !== values.quantity) {
        //     message.error("Tổng số lượng size không bằng tổng số lượng sản phẩm!");
        //     setLoading(false);
        //     return;
        //   }
        // }

        // // Loại bỏ thuộc tính images khỏi đối tượng values
        // const { images, ...productRequest } = values;

        // productRequest.sizes = sizes; // Gán sizes là [] nếu không còn kích thước
        // productRequest.categoryName = values.categoryName || form.getFieldValue("categoryName");

        // const imageFiles = fileList.filter((file) => file.originFileObj).map((file) => file.originFileObj);

        // dispatch(updateProduct(categoryId, formData)) // Đảm bảo là số ))
        //   .then(() => {
        //     Swal.fire("Đã cập nhật!", "Sản phẩm đã được cập nhật thành công.", "success");
        //     refetch();
        //     onCancel();
        //   })
        //   .catch((error) => {
        //     console.error("Failed to update product:", error);
        //     Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật sản phẩm.", "error");
        //   })
        //   .finally(() => setLoading(false));

        // console.log("Submitted Data:", formData);
        // console.log("categoryId", categoryId);

        // Gửi dữ liệu đi (ví dụ: API call)

        floweriestApi
          .updateFlower(formData)
          .then(() => {
            refetch();
            setFileList([]);
            Swal.fire("Đã cập nhật!", "Sản phẩm đã được cập nhật thành công.", "success");
            message.success("Cập nhật sản phẩm thành công");
          })
          .catch(() => {
            message.error("Cập nhật thất bại");
            Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật sản phẩm.", "error");
          })
          .finally(() => {
            setLoading(false); // Đảm bảo loading về false dù thành công hay thất bại
          });

        // dispatch({
        //   type: UPDATE_PRODUCT_SUCCESS,
        //   payload: "Product updated successfully",
        // });
      }
    });
  };

  //   const handleFileChange = ({ fileList: newFileList, file }) => {
  //     // Kiểm tra nếu file bị xóa (status là "removed")
  //     if (file.status === "removed" && file.url) {
  //       // Lưu trữ ảnh bị xóa tạm thời
  //       setDeletedFileList([...deletedFileList, file]);

  //       // Xóa ảnh bằng cách gọi API xóa
  //       dispatch(deleteProductImage(productID, file.uid))
  //         .then(() => {
  //           message.success("Ảnh đã được xóa thành công");
  //         })
  //         .catch((error) => {
  //           message.error("Xóa ảnh thất bại");
  //           console.error("Delete image failed:", error);
  //         });
  //     }

  //     setFileList(newFileList);
  //   };

  const handleCancel = () => {
    // Khôi phục lại danh sách ảnh đã bị xóa tạm thời
    setFileList([...fileList, ...deletedFileList]);
    setDeletedFileList([]);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title={<div className="text-center text-lg font-semibold">Cập nhật sản phẩm</div>}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
      style={{ top: 20 }}
      styles={{ body: { padding: "20px" } }} // Thay vì bodyStyle={{ padding: "20px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title="Thông tin sản phẩm"
              bordered={false}
              style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
            >
              <Form.Item
                name="name"
                label="Tên hoa"
                rules={[{ required: true, message: "Vui lòng nhập tên hoa" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input placeholder="Nhập tên hoa" />
              </Form.Item>

              <Form.Item
                name="color"
                label="Màu hoa"
                rules={[{ required: true, message: "Vui lòng nhập màu hoa" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input placeholder="Nhập màu hoa" />
              </Form.Item>

              <Form.Item
                name="flowerType"
                label="Loại"
                rules={[{ required: true, message: "Vui lòng nhập loại" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input.TextArea rows={4} placeholder="Nhập loại của hoa" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá tiền"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input placeholder="Nhập giá tiền" type="number" />
              </Form.Item>

              <Form.Item name="image" label="Ảnh hoa" rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}>
                <Upload
                  beforeUpload={() => false} // Không tự động tải lên
                  listType="picture"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Trạng thái"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                style={{ marginBottom: "16px" }}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value={true}>Hoạt động</Select.Option>
                  <Select.Option value={false}>Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

//       {/* <Form form={form} layout="vertical" onFinish={handleUpdate}>
//         <Row gutter={24}>
//           <Col span={12}>
//             <Card title="Thông tin cơ bản" bordered={false}>
//               <Form.Item name="productName" label="Tên sản phẩm" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//               <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
//                 <Input.TextArea rows={4} />
//               </Form.Item>

//               <Form.Item name="isActive" label="Trạng thái" >

//               </Form.Item>

//               {/* <Form.Item name="categoryName" label="Danh mục">
//                                 <Input />
//                             </Form.Item> */}
//             </Card>
//             <Divider />
//             {/* <Card title="Giá và số lượng" bordered={false}>
//                                 <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number', min: 0 }]}>
//                                     <InputNumber style={{ width: '100%' }} />
//                                 </Form.Item>
//                                 <Form.Item name="discount" label="Giảm giá (%)" rules={[{ type: 'number', min: 0, max: 100 }]}>
//                                     <InputNumber style={{ width: '100%' }} />
//                                 </Form.Item>
//                                 <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, type: 'number', min: 0 }]}>
//                                     <InputNumber style={{ width: '100%' }} />
//                                 </Form.Item>
//                             </Card> */}
//           </Col>
//           {/* <Col span={12}>
//                         <Card title="Thông tin bổ sung" bordered={false}>
//                             <Form.Item name="colour" label="Màu sắc">
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item name="featured" label="Sản phẩm nổi bật" valuePropName="checked">
//                                 <Switch />
//                             </Form.Item>
//                             <Form.Item name="productStatus" label="Trạng thái sản phẩm" valuePropName="checked">
//                                 <Switch />
//                             </Form.Item>
//                         </Card>
//                         <Divider />
//                         <Card title="Kích thước sản phẩm" bordered={false}>
//                             <Form.List name="sizes">
//                                 {(fields, { add, remove }) => (
//                                     <>
//                                         {fields.map(({ key, name, fieldKey, ...restField }) => (
//                                             <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                                                 <Form.Item
//                                                     {...restField}
//                                                     name={[name, 'text']}
//                                                     fieldKey={[fieldKey, 'text']}
//                                                     label="Kích thước"
//                                                     rules={[{ required: true, message: 'Nhập kích thước!' }]}
//                                                 >
//                                                     <Input placeholder="Nhập kích thước" />
//                                                 </Form.Item>
//                                                 <Form.Item
//                                                     {...restField}
//                                                     name={[name, 'price']}
//                                                     fieldKey={[fieldKey, 'price']}
//                                                     label="Giá"
//                                                     rules={[{ required: true, message: 'Nhập giá!' }]}
//                                                 >
//                                                     <InputNumber placeholder="Nhập giá" />
//                                                 </Form.Item>
//                                                 <Form.Item
//                                                     {...restField}
//                                                     name={[name, 'sizeQuantity']}
//                                                     fieldKey={[fieldKey, 'sizeQuantity']}
//                                                     label="Số lượng"
//                                                     rules={[{ required: true, message: 'Nhập số lượng!' }]}
//                                                 >
//                                                     <InputNumber placeholder="Nhập số lượng" />
//                                                 </Form.Item>
//                                                 <MinusCircleOutlined onClick={() => remove(name)} />
//                                             </Space>
//                                         ))}
//                                         <Form.Item>
//                                             <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                                 Thêm kích thước
//                                             </Button>
//                                         </Form.Item>
//                                     </>
//                                 )}
//                             </Form.List>
//                         </Card>
//                         <Divider />
//                         <Card title="Hình ảnh sản phẩm" bordered={false}>
//                             <Form.Item name="images" label="Hình ảnh">
//                                 <Upload
//                                     listType="picture-card"
//                                     fileList={fileList}
//                                     onChange={handleFileChange}
//                                     beforeUpload={() => false}
//                                 >
//                                     {fileList.length >= 8 ? null : (
//                                         <div>
//                                             <PlusOutlined />
//                                             <div style={{ marginTop: 8 }}>Tải lên</div>
//                                         </div>
//                                     )}
//                                 </Upload>
//                             </Form.Item>
//                         </Card>
//                     </Col> */}
// //         </Row>
// //       </Form> */}
// //     </Modal>
// //   );

// };

export default UpdateFlower;
