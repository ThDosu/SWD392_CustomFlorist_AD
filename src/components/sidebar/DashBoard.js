import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Row, Col, Card, Statistic, Typography, Space } from "antd";
import { ShopOutlined, UserOutlined, DollarOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  fetchReceivedRevenueByStore,
  fetchPlacedOrdersCount,
  fetchTotalProductsByStore,
  fetchTotalOrdersByStoreInTime,
  fetchTotalPaymentByStoreInTime,
  fetchTotalProductByStoreInTime,
} from "../../redux/actions/revenueActions";

const { Title } = Typography;

const getDateTime = (month, year) => {
  const startDate = moment(`${year}-${month}-01`).startOf("month").format("YYYY-MM-DD HH:mm:ss");
  const endDate = moment(`${year}-${month}-01`).endOf("month").format("YYYY-MM-DD HH:mm:ss");

  return { startDate, endDate };
};

const Dashboard = () => {
  const [receivedRevenue, setReceivedRevenue] = useState(0);
  const [placedOrdersCount, setPlacedOrdersCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({
    revenue: false,
    orders: false,
    products: false,
  });
  const [error, setError] = useState({
    revenue: null,
    orders: null,
    products: null,
  });

  const dispatch = useDispatch();
  const storeID = localStorage.getItem("storeID");

  // Fetch tổng doanh thu
  useEffect(() => {
    const fetchRevenue = async () => {
      if (!storeID) return;

      setLoading((prev) => ({ ...prev, revenue: true }));
      try {
        const data = await dispatch(fetchReceivedRevenueByStore(storeID));
        setReceivedRevenue(data);
        setError((prev) => ({ ...prev, revenue: null }));
      } catch (err) {
        console.error("Error fetching revenue:", err);
        setReceivedRevenue(0);
        setError((prev) => ({ ...prev, revenue: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, revenue: false }));
      }
    };

    fetchRevenue();
  }, [dispatch, storeID]);

  // Fetch tổng số đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      if (!storeID) return;

      setLoading((prev) => ({ ...prev, orders: true }));
      try {
        const data = await dispatch(fetchPlacedOrdersCount(storeID));
        setPlacedOrdersCount(data);
        setError((prev) => ({ ...prev, orders: null }));
      } catch (err) {
        console.error("Error fetching orders:", err);
        setPlacedOrdersCount(0);
        setError((prev) => ({ ...prev, orders: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, orders: false }));
      }
    };

    fetchOrders();
  }, [dispatch, storeID]);

  // Fetch tổng số sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeID) return;

      setLoading((prev) => ({ ...prev, products: true }));
      try {
        const data = await dispatch(fetchTotalProductsByStore(storeID));
        setTotalProducts(data);
        setError((prev) => ({ ...prev, products: null }));
      } catch (err) {
        console.error("Error fetching products:", err);
        setTotalProducts(0);
        setError((prev) => ({ ...prev, products: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    };

    fetchProducts();
  }, [dispatch, storeID]);

  // Fetch dữ liệu biểu đồ
  useEffect(() => {
    const fetchChartData = async () => {
      if (!storeID) return;

      const months = [8, 9, 10, 11, 12];
      const year = new Date().getFullYear();
      const dataPromises = months.map(async (month) => {
        const { startDate, endDate } = getDateTime(month, year);

        try {
          const [products, orders, payments] = await Promise.all([
            dispatch(fetchTotalProductByStoreInTime(storeID, startDate, endDate)),
            dispatch(fetchTotalOrdersByStoreInTime(storeID, startDate, endDate)),
            dispatch(fetchTotalPaymentByStoreInTime(storeID, startDate, endDate)),
          ]);

          return {
            month: `Tháng ${month}`,
            stores: products,
            accounts: orders,
            revenue: payments,
          };
        } catch (error) {
          console.error(`Error fetching data for month ${month}:`, error);
          return {
            month: `Tháng ${month}`,
            stores: 0,
            accounts: 0,
            revenue: 0,
          };
        }
      });

      const chartData = await Promise.all(dataPromises);
      setChartData(chartData);
    };

    fetchChartData();
  }, [dispatch, storeID]);

  const cardStyle = {
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  };

  const iconStyle = {
    fontSize: "24px",
    // color: "#ff69b4",
    color: "#4ded95",
  };

  const chartCardStyle = {
    ...cardStyle,
    marginTop: "5px",
    padding: "20px",
  };

  const renderStatisticCard = (title, value, prefix, loading, error) => (
    <Card style={cardStyle}>
      <Statistic
        title={title}
        value={error ? 0 : value}
        prefix={prefix}
        loading={loading}
        suffix={
          !error &&
          !loading && (
            <span style={{ fontSize: "14px", color: "#52c41a" }}>
              <ArrowUpOutlined /> 20%
            </span>
          )
        }
      />
      {error && <div style={{ color: "red", fontSize: "12px" }}>{error}</div>}
    </Card>
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%", overflowX: "hidden", padding: "0 10px" }}>
      <Title level={2} style={{ color: "#333" }}>
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          {renderStatisticCard(
            "Tổng số sản phẩm",
            totalProducts,
            <ShopOutlined style={iconStyle} />,
            loading.products,
            error.products
          )}
        </Col>
        <Col xs={24} sm={8}>
          {renderStatisticCard(
            "Tổng số đơn hàng",
            placedOrdersCount,
            <UserOutlined style={iconStyle} />,
            loading.orders,
            error.orders
          )}
        </Col>
        <Col xs={24} sm={8}>
          {renderStatisticCard(
            "Tổng doanh thu",
            receivedRevenue,
            <DollarOutlined style={iconStyle} />,
            loading.revenue,
            error.revenue
          )}
        </Col>
      </Row>
      <Card style={chartCardStyle}>
        <Title level={4}>Biểu đồ thống kê</Title>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="stores" name="Số sản phẩm" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="accounts" name="Số đơn hàng" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="revenue" name="Số giao dịch" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Space>
  );
};

export default Dashboard;
