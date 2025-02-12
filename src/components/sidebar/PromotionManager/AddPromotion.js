import React from 'react';
import { Form, Input, Button, message, Card, DatePicker, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { createPromotion } from '../../../redux/actions/promotionActions';

const AddPromotion = () => {
    const dispatch = useDispatch();

    const onFinish = (values) => {
        const promotionRequest = {
            promotionName: values.promotionName,
            promotionCode: values.promotionCode,
            promotionDescription: values.promotionDescription,
            promotionStatus: values.promotionStatus,
            promotionDiscount: values.promotionDiscount,
            quantity: values.quantity,
            startDate: moment(values.startDate).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(values.endDate).format('YYYY-MM-DD HH:mm:ss'),
        };

        const storeID = localStorage.getItem('storeID');

        dispatch(createPromotion(storeID, promotionRequest))
            .then(() => {
                message.success('Promotion created successfully!');
            })
            .catch((error) => {
                message.error('Failed to create promotion');
            });
    };

    return (
        <Card className="add-promotion-container" style={{ maxWidth: 1600, margin: '0 auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#F56285' }}>Thêm Khuyến Mãi</h2>
            <Form onFinish={onFinish}>
                <Form.Item name="promotionName" label="Tên khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="promotionCode" label="Mã khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="promotionDescription" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="promotionStatus" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng nhập trạng thái!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="promotionDiscount" label="Giảm giá" rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}>
                    <InputNumber min={0} max={1} step={0.01} />
                </Form.Item>
                <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo Khuyến Mãi
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddPromotion;