import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPromotions, getPromotionByStatus, deletePromotion } from "../../../redux/actions/promotionActions";
import { Button, Input, Select, Table, Empty, Tabs, Modal } from "antd";
import AddPromotion from "./AddUser";
import UpdatePromotion from "./UpdateUser";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "../ProductManager/ProductList.css";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { userApi } from "../../../apis/users/userMutation";
import UpdateUser from "./UpdateUser";
import EditRole from "./EditRole";
const { Option } = Select;
const { TabPane } = Tabs;

const roleMapping = {
  admin: { label: "Quản trị viên", color: "red" },
  manager: { label: "Quản lý", color: "red" },
  shipper: { label: "Người giao hàng", color: "#B8860B" },
  customer: { label: "Khách hàng", color: "green" },
};

const rolesSelectMapping = {
  admin: "Quản trị viên",
  manager: "Quản lý",
  shipper: "Người giao hàng",
  customer: "Khách hàng",
};

const statusMapping = {
  ACTIVE: { label: "Hoạt động", color: "green" },
  BANNED: { label: "Đình chỉ", color: "red" },
};

const UserList = () => {
  // const dispatch = useDispatch();
  // const state = useSelector((state) => state) || [];
  // console.log("state", state);

  const promotions = useSelector((state) => state.promotionData.promotions) || [];
  // const error = useSelector((state) => state.promotionData.error);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  const [updateRoleModalVisible, setUpdateRoleModalVisible] = useState(false);

  const {
    data: userList = [],
    refetch,
    error,
  } = useQuery({
    queryKey: ["user"], // Giúp cache dữ liệu
    queryFn: () => userApi.getAllUser(), // ✅ Không cần async wrapper nữa
    refetchOnWindowFocus: false,
  });

  console.log("userList", userList);

  // useEffect(() => {
  //   dispatch(getAllPromotions());
  // }, [dispatch]);

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

  const handleUpdateRoleClick = (promotionId) => {
    setSelectedPromotionId(promotionId);
    setUpdateRoleModalVisible(true);
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
        // dispatch(deletePromotion([promotionId]))
        //   .then(() => {
        //     Swal.fire("Đã xóa!", "Sản phẩm đã được xóa thành công.", "success");
        //     dispatch(getAllPromotions());
        //   })
        //   .catch((error) => {
        //     Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa sản phẩm.", "error");
        //   });
      }
    });
  };

  const columns = [
    {
      title: "Mã người dùng",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    // {
    //   title: "Số lượng",
    //   dataIndex: "quantity",
    //   key: "quantity",
    // },

    {
      title: "Điện thoại  ",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (text) => {
        const role = roleMapping[String(text).toLowerCase()] || { label: text, color: "gray" };
        return <span style={{ color: role.color, fontWeight: "bold" }}>{role.label}</span>;
      },
    },

    {
      title: "Điểm ",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Trạng thái",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (text) => {
        const role = statusMapping[text] || { label: text, color: "gray" };
        return <span style={{ color: role.color, fontWeight: "bold" }}>{role.label}</span>;
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button icon={<EditOutlined />} onClick={() => handleUpdateClick(record.id)}>
            Chỉnh sửa trạng thái
          </Button>
          {/* <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record.id)}>
            Xóa
          </Button> */}
          <Button icon={<EditOutlined />} onClick={() => handleUpdateRoleClick(record.id)}>
            Chỉnh sửa vai trò
          </Button>
        </div>
      ),
    },
  ];

  const filteredUser = userList.filter(
    (user) =>
      (searchTerm ? user.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (selectedCategory ? String(user.role).toLowerCase() === selectedCategory : true)
  );

  const activePromotion = userList.filter((user) => user.accountStatus === "ACTIVE") || [];
  const inactivePromotion = userList.filter((user) => user.accountStatus !== "ACTIVE") || [];

  console.log("activePromotion", activePromotion);

  const uniroles = [...new Set((userList || []).map((user) => user.role))];

  console.log("uniroles", uniroles);

  const customLocale = {
    triggerDesc: "Nhấn để sắp xếp giảm dần",
    triggerAsc: "Nhấn để sắp xếp tăng dần",
    cancelSort: "Nhấn để hủy sắp xếp",
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={error || "Không tìm thấy mã giảm giá"} />,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Người dùng</h1>
      <div style={{ display: "flex", justifyContent: "start", marginBottom: "20px" }}>
        {error ? (
          <p className="text-red-500">Không thể tải danh sách vai trò</p>
        ) : (
          <Select defaultValue="" style={{ width: 200, borderColor: "#F56285" }} onChange={setSelectedCategory}>
            <Option value="">Tất cả vai trò</Option>
            {uniroles.map((role) => (
              <Option key={role} value={String(role).toLowerCase().trim()}>
                {rolesSelectMapping[String(role).trim().toLowerCase()] || role}
              </Option>
            ))}
          </Select>
        )}

        {/* <Button
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
        </Modal> */}
      </div>
      <Input
        placeholder="Tìm tên người dùng"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", borderColor: "#1fe879" }}
        suffix={<SearchOutlined style={{ fontSize: "18px", color: "#bfbfbf" }} />}
      />

      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả" key="all">
          <Table
            columns={columns}
            dataSource={filteredUser}
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
        <TabPane tab="Đình chỉ" key="inactive">
          <Table
            columns={columns}
            dataSource={inactivePromotion}
            rowKey="promotionID"
            locale={customLocale}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
      <UpdateUser
        userID={selectedPromotionId}
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        refetch={refetch}
      />

      <EditRole
        userID={selectedPromotionId}
        visible={updateRoleModalVisible}
        onClose={() => setUpdateRoleModalVisible(false)}
        refetch={refetch}
      />
    </div>
  );
};

export default UserList;
