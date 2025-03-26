import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPromotions, getPromotionByStatus, deletePromotion } from "../../../redux/actions/promotionActions";
import { Button, Input, Select, Table, Empty, Tabs, Modal } from "antd";
import AddPromotion from "./AddPromotion";
import UpdatePromotion from "./UpdatePromotion";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "../ProductManager/ProductList.css";
import dayjs from "dayjs";
const { Option } = Select;
const { TabPane } = Tabs;

const PromotionList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state) || [];
  console.log("state", state);

  const promotions = useSelector((state) => state.promotionData.promotions) || [];
  const error = useSelector((state) => state.promotionData.error);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  console.log("promotions", promotions);

  useEffect(() => {
    dispatch(getAllPromotions());
  }, [dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const handleTabChange = (key) => {
  //   switch (key) {
  //     case "all":
  //       dispatch(getAllPromotions());
  //       break;
  //     case "active":
  //       dispatch(getPromotionByStatus("Có hiệu lực"));
  //       break;
  //     case "violated":
  //       dispatch(getPromotionByStatus("Hết hiệu lực"));
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const handleUpdateClick = (promotionId) => {
    setSelectedPromotionId(promotionId);
    setUpdateModalVisible(true);
  };

  const handleDeleteClick = (promotionId) => {
    console.log("promotionId", promotionId);

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
        dispatch(deletePromotion([promotionId]))
          .then(() => {
            Swal.fire("Đã xóa!", "Sản phẩm đã được xóa thành công.", "success");
            dispatch(getAllPromotions());
          })
          .catch((error) => {
            Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa sản phẩm.", "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "Mã bó hoa",
      dataIndex: "bouquetId",
      key: "bouquetId",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "code",
      key: "code",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Mã khuyến mãi",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "promotionDescription",
    //   key: "promotionDescription",
    // },
    {
      title: "Giảm giá",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      render: (text) => <span>{text}%</span>,
    },
    // {
    //   title: "Số lượng",
    //   dataIndex: "quantity",
    //   key: "quantity",
    // },

    {
      title: "Ngày bắt đầu",
      dataIndex: "validFrom",
      key: "validFrom",
      render: (validFrom) => dayjs(validFrom).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "validTo",
      key: "validTo",
      render: (validTo) => dayjs(validTo).format("DD/MM/YYYY"),
    },

    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (text) => (
        <span style={{ color: text ? "green" : "red", fontWeight: "bold" }}>
          {text ? "Đang kích hoạt" : "Chưa kích hoạt"}
        </span>
      ),
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button icon={<EditOutlined />} onClick={() => handleUpdateClick(record.id)}>
            Chỉnh sửa
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const filteredPromotions = promotions.filter((promotion) =>
    promotion.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const activePromotion = promotions.filter((promotion) => promotion.active);
  const inactivePromotion = promotions.filter((promotion) => !promotion.active);

  console.log("activePromotion", activePromotion);

  const categories = [...new Set(promotions.map((promotion) => promotion.categoryName))];

  const customLocale = {
    triggerDesc: "Nhấn để sắp xếp giảm dần",
    triggerAsc: "Nhấn để sắp xếp tăng dần",
    cancelSort: "Nhấn để hủy sắp xếp",
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={error || "Không tìm thấy mã giảm giá"} />,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý khuyến mãi</h1>
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
        <Button
          type="primary"
          style={{ background: "#1a1a1a", borderColor: "#1fe879" }}
          className="custom-button"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          Thêm mã khuyến mãi
        </Button>
        <Modal title="Thêm Khuyến Mãi" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
          <AddPromotion />
        </Modal>
      </div>
      <Input
        placeholder="Tìm khuyến mãi mà bạn muốn..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", borderColor: "#1fe879" }}
        suffix={<SearchOutlined style={{ fontSize: "18px", color: "#bfbfbf" }} />}
      />

      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả" key="all">
          <Table
            columns={columns}
            dataSource={filteredPromotions}
            rowKey="promotionID"
            locale={customLocale}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Đang Hoạt Động" key="active">
          <Table
            columns={columns}
            dataSource={activePromotion}
            rowKey="promotionID"
            locale={customLocale}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        {/* z */}
        <TabPane tab="Chưa Hoạt Động" key="inactive">
          <Table
            columns={columns}
            dataSource={inactivePromotion}
            rowKey="promotionID"
            locale={customLocale}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
      <UpdatePromotion
        promotionID={selectedPromotionId}
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
      />
    </div>
  );
};

export default PromotionList;
