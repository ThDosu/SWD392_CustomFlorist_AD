import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  getProductsByStoreIDBySeller,
  getProductsByStoreIDWithStatusFalse,
  getProductsByStoreIDWithStatusTrue,
  deleteProduct,
  GET_PRODUCTS_BY_STOREID_BY_SELLER,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_ID,
  getAllProducts,
} from "../../../redux/actions/productActions";
import { Button, Input, Select, Table, Empty, Tabs, Spin, Space } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import "./ProductList.css";
import { useQuery } from "react-query";
import { categoriesApi } from "../../../apis/categories/categoriesMutation";
import { floweriestApi } from "../../../apis/flowers/flowersMutation";

const { Option } = Select;
const { TabPane } = Tabs;

const ProductList = () => {
  const dispatch = useDispatch();
  // const state = useSelector((state) => state);
  // console.log("Redux State:", state);

  // const products = useSelector((state) => state.productData.selectedCategoryId) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [page, setPage] = useState(0); // State để lưu số trang hiện tại

  // useEffect(() => {
  //   dispatch(getAllProducts());
  // }, [dispatch]);

  const { data: cateData = [], refetch } = useQuery({
    queryKey: ["caterories"], // Giúp cache dữ liệu
    queryFn: () => categoriesApi.getAllCategories(), // ✅ Không cần async wrapper nữa
    refetchOnWindowFocus: false,
  });

  const products = cateData;

  console.log("cateData", cateData);

  // useEffect(() => {
  //   if (cateData) {
  //     dispatch({
  //       type: GET_ALL_PRODUCTS,
  //       payload: cateData, // Truyền dữ liệu vào Redux
  //     });
  //   }
  // }, [cateData, dispatch]);

  console.log("products", products);

  console.log("cateData", cateData);

  const handleTabChange = (key) => {
    switch (key) {
      case "all":
        dispatch(getProductsByStoreIDBySeller(localStorage.getItem("storeID")));
        break;
      case "active":
        dispatch(getProductsByStoreIDWithStatusTrue(localStorage.getItem("storeID")));
        break;
      case "violated":
        dispatch(getProductsByStoreIDWithStatusFalse(localStorage.getItem("storeID")));
        break;
      default:
        break;
    }
  };

  const handleUpdateClick = (categoryId) => {
    console.log("categoryId", categoryId);

    setSelectedCategoryId(categoryId);
    setUpdateModalVisible(true);
  };

  const handleDeleteClick = (productId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(productId))
          .then(() => {
            Swal.fire("Đã xóa!", "Sản phẩm đã được xóa thành công.", "success");
            dispatch(getProductsByStoreIDBySeller(localStorage.getItem("storeID")));
          })
          .catch((error) => {
            Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa sản phẩm.", "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "categoryId",
      key: "categoryId",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <span>{text}</span>
        </div>
      ),
    },

    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          {/* <img
            src={record.images[0]?.productImage}
            alt={text}
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          /> */}
          <span>{text}</span>
        </div>
      ),
    },
    // {
    //   title: "Doanh số",
    //   dataIndex: "sold",
    //   key: "sold",
    //   sorter: (a, b) => a.sold - b.sold,
    // },
    // {
    //   title: "Giá",
    //   dataIndex: "price",
    //   key: "price",
    //   render: (price) => (price != null ? `${price.toFixed(2)} VNĐ` : "N/A"),
    //   sorter: (a, b) => a.price - b.price,
    // },

    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      width: 800,
      align: "center",
      render: (description) => (
        <span>{description.length > 200 ? description.slice(0, 500) + "..." : description}</span>
      ),
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Hoạt động</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Không hoạt động</span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleUpdateClick(record.categoryId)} icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
          {/* <Button type="link" danger onClick={() => handleDeleteClick(record.categoryId)} icon={<DeleteOutlined />}>
            Xóa
          </Button> */}
        </Space>
      ),
    },
  ];

  // const columnFlowers = [
  //   {
  //     title: "Mã hoa",
  //     dataIndex: "flowerId",
  //     key: "flowerId",
  //     align: "center",
  //     render: (text, record) => (
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <span>{text}</span>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Tên sản phẩm",
  //     dataIndex: "name",
  //     key: "name",
  //     align: "center",
  //     render: (text, record) => (
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <img
  //           src="https://dalat.flowers/album/1144_hong-do-nhung-30-canh.jpg"
  //           alt={text}
  //           style={{ width: "50px", height: "50px", marginRight: "10px" }}
  //         />
  //         <span>{text}</span>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Loại",
  //     dataIndex: "flowerType",
  //     key: "flowerType",
  //     render: (text) => <span>{text}</span>,
  //   },
  //   {
  //     title: "Giá",
  //     dataIndex: "price",
  //     key: "price",
  //     render: (price) =>
  //       price != null ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price) : "N/A",
  //   },

  //   {
  //     title: "Màu sắc",
  //     key: "color",
  //     dataIndex: "color",

  //     align: "center",
  //     render: (text) => <span>{text}</span>,
  //   },
  //   {
  //     title: "Trạng thái hoạt động",
  //     dataIndex: "isActive",
  //     key: "isActive",
  //     align: "center",
  //     render: (isActive) =>
  //       isActive ? (
  //         <span style={{ color: "green", fontWeight: "bold" }}>Hoạt động</span>
  //       ) : (
  //         <span style={{ color: "red", fontWeight: "bold" }}>Không hoạt động</span>
  //       ),
  //   },
  //   {
  //     title: "Thao tác",
  //     key: "action",
  //     width: 150,
  //     align: "center",
  //     render: (_, record) => (
  //       <>
  //         <Button type="link" onClick={() => handleUpdateClick(record.categoryId)} icon={<EditOutlined />}>
  //           Chỉnh sửa
  //         </Button>
  //         <Button type="link" danger onClick={() => handleDeleteClick(record.productID)} icon={<DeleteOutlined />}>
  //           Xóa
  //         </Button>
  //       </>
  //     ),
  //   },
  // ];

  const filteredProducts = products.filter((product) => product.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const activeProducts = products.filter((product) => product.isActive);
  const inactiveProducts = products.filter((product) => !product.isActive);

  const categories = [...new Set(products.map((product) => product.categoryName))];

  const customLocale = {
    triggerDesc: "Nhấn để sắp xếp giảm dần",
    triggerAsc: "Nhấn để sắp xếp tăng dần",
    cancelSort: "Nhấn để hủy sắp xếp",
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="Không tìm thấy sản phẩm" />,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý sản phẩm</h1>
      <div style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>
        {/* <Select
          defaultValue=""
          style={{ width: 200, borderColor: "#F56285" }}
          onChange={(value) => setSelectedCategory(value)}
        >
          <Option value="">Tất cả danh mục</Option>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select> */}
        <NavLink to="/banhang/add-product">
          <Button type="primary" style={{ background: "#1a1a1a", borderColor: "#1fe879" }} icon={<PlusOutlined />}>
            Thêm 1 sản phẩm mới
          </Button>
        </NavLink>
      </div>
      <Input
        placeholder="Tìm tên sản phẩm"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", borderColor: "#aaf6cc" }}
        suffix={<SearchOutlined style={{ fontSize: "18px", color: "#aaf6cc" }} />}
      />
      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả" key="all">
          <Table
            columns={columns}
            dataSource={filteredProducts} // Đảm bảo là mảng
            rowKey="categoryId"
            locale={customLocale}
            pagination={{
              pageSize: 10,
              current: page + 1, // Chuyển đổi từ index 0 thành index 1 của Ant Design
              onChange: (pageNumber) => {
                setPage(pageNumber - 1); // Giữ state theo index 0
                dispatch(getProductsByStoreIDBySeller(pageNumber - 1)); // Gọi API với trang mới
              },
            }}
          />
        </TabPane>
        <TabPane tab="Đang Hoạt Động" key="active">
          <Table
            columns={columns}
            dataSource={Array.isArray(activeProducts) ? activeProducts : []}
            rowKey="categoryId"
            locale={customLocale}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Không Hoạt Động" key="inactive">
          <Table
            columns={columns}
            dataSource={Array.isArray(inactiveProducts) ? inactiveProducts : []}
            rowKey="categoryId"
            locale={customLocale}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        {/* <TabPane tab="Các loại hoa" key="flowers">
          {isFlowerLoading ? (
            <Spin size="large" />
          ) : (
            <Table
              columns={columnFlowers}
              dataSource={flowerData || []} // Tránh lỗi khi dữ liệu chưa sẵn sàng
              rowKey="categoryId"
              locale={customLocale}
              pagination={{ pageSize: 10 }}
            />
          )}
        </TabPane> */}
      </Tabs>
      <UpdateProduct
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        categoryId={selectedCategoryId}
        refetch={refetch}
      />
    </div>
  );
};

export default ProductList;
