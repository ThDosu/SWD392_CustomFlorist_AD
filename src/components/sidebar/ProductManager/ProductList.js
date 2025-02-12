import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getProductsByStoreIDBySeller, getProductsByStoreIDWithStatusFalse, getProductsByStoreIDWithStatusTrue, deleteProduct } from '../../../redux/actions/productActions';
import { Button, Input, Select, Table, Empty, Tabs } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateProduct from './UpdateProduct';
import Swal from 'sweetalert2';
import './ProductList.css';

const { Option } = Select;
const { TabPane } = Tabs;

const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.productData.products) || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const storeID = localStorage.getItem('storeID');
        dispatch(getProductsByStoreIDBySeller(storeID));
    }, [dispatch]);

    const handleTabChange = (key) => {
        switch (key) {
            case 'all':
                dispatch(getProductsByStoreIDBySeller(localStorage.getItem('storeID')));
                break;
            case 'active':
                dispatch(getProductsByStoreIDWithStatusTrue(localStorage.getItem('storeID')));
                break;
            case 'violated':
                dispatch(getProductsByStoreIDWithStatusFalse(localStorage.getItem('storeID')));
                break;
            default:
                break;
        }
    };

    const handleUpdateClick = (productId) => {
        setSelectedProductId(productId);
        setUpdateModalVisible(true);
    };

    const handleDeleteClick = (productId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteProduct(productId))
                    .then(() => {
                        Swal.fire(
                            'Đã xóa!',
                            'Sản phẩm đã được xóa thành công.',
                            'success'
                        );
                        dispatch(getProductsByStoreIDBySeller(localStorage.getItem('storeID')));
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Lỗi!',
                            'Có lỗi xảy ra khi xóa sản phẩm.',
                            'error'
                        );
                    });
            }
        });
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={record.images[0]?.productImage}
                        alt={text}
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Doanh số',
            dataIndex: 'sold',
            key: 'sold',
            sorter: (a, b) => a.sold - b.sold,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price != null ? `${price.toFixed(2)} VNĐ` : 'N/A',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Mô tả',
            key: 'description',
            dataIndex: 'description',
            width: 800, 
            render: description => (
                <span>
                    {description.length > 200 ? description.slice(0, 500) + '...' : description}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleUpdateClick(record.productID)} icon={<EditOutlined />}>Chỉnh sửa</Button>
                    <Button type="link" danger onClick={() => handleDeleteClick(record.productID)} icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || product.categoryName === selectedCategory)
    );

    const categories = [...new Set(products.map(product => product.categoryName))];

    const customLocale = {
        triggerDesc: 'Nhấn để sắp xếp giảm dần',
        triggerAsc: 'Nhấn để sắp xếp tăng dần',
        cancelSort: 'Nhấn để hủy sắp xếp',
        emptyText: (
            <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="Không tìm thấy sản phẩm"
            />
        ),
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Sản phẩm</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Select defaultValue="" style={{ width: 200, borderColor: '#F56285' }} onChange={value => setSelectedCategory(value)}>
                    <Option value="">Tất cả danh mục</Option>
                    {categories.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                    ))}
                </Select>
                <NavLink to="/banhang/add-product">
                    <Button type="primary" style={{ background: '#F56285', borderColor: '#F56285' }} icon={<PlusOutlined />}>
                        Thêm 1 sản phẩm mới
                    </Button>
                </NavLink>
            </div>
            <Input
                placeholder="Tìm tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', borderColor: '#F56285' }}
                suffix={<SearchOutlined style={{ fontSize: '18px', color: '#bfbfbf' }} />}
            />
            <Tabs defaultActiveKey="all" onChange={handleTabChange}>
                <TabPane tab="Tất cả" key="all">
                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="productID"
                        locale={customLocale}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Đang Hoạt Động" key="active">
                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="productID"
                        locale={customLocale}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Vi Phạm" key="violated">
                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="productID"
                        locale={customLocale}
                        pagination={{ pageSize: 10 }} 
                    />
                </TabPane>
            </Tabs>
            <UpdateProduct
                visible={updateModalVisible}
                onCancel={() => setUpdateModalVisible(false)}
                productID={selectedProductId}
            />
        </div>
    );
};

export default ProductList;