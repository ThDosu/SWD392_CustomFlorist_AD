import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updatePromotion, getPromotionById } from '../../../redux/actions/promotionActions';
import Swal from 'sweetalert2';

const UpdatePromotion = ({ promotionID, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const selectedPromotion = useSelector(state => state.promotionData.selectedPromotion);

    useEffect(() => {
        if (promotionID) {
            dispatch(getPromotionById(promotionID));
        }
    }, [dispatch, promotionID]);

    useEffect(() => {
        if (selectedPromotion) {
            form.setFieldsValue({
                promotionName: selectedPromotion.promotionName,
                promotionCode: selectedPromotion.promotionCode,
                promotionDescription: selectedPromotion.promotionDescription,
                promotionDiscount: selectedPromotion.promotionDiscount,
                quantity: selectedPromotion.quantity,
                startDate: selectedPromotion.startDate,
                endDate: selectedPromotion.endDate,
            });
        }
    }, [selectedPromotion, form]);

    const handleUpdate = () => {
        form.validateFields().then((values) => {
            dispatch(updatePromotion(promotionID, values))
                .then(() => {
                    Swal.fire('Cập nhật thành công!', 'Khuyến mãi đã được cập nhật.', 'success');
                    onClose();
                })
                .catch((error) => {
                    Swal.fire('Lỗi', 'Cập nhật khuyến mãi thất bại. Vui lòng thử lại.', 'error');
                });
        });
    };

    return (
        <Modal
            title="Cập nhật khuyến mãi"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="promotionName"
                    label="Tên khuyến mãi"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}
                >
                    <Input placeholder="Nhập tên khuyến mãi" />
                </Form.Item>
                <Form.Item
                    name="promotionCode"
                    label="Mã khuyến mãi"
                    rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}
                >
                    <Input placeholder="Nhập mã khuyến mãi" />
                </Form.Item>
                <Form.Item
                    name="promotionDescription"
                    label="Mô tả"
                >
                    <Input placeholder="Nhập mô tả khuyến mãi" />
                </Form.Item>
                <Form.Item
                    name="promotionDiscount"
                    label="Giảm giá (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}
                >
                    <Input placeholder="Nhập phần trăm giảm giá" type="number" />
                </Form.Item>
                <Form.Item
                    name="quantity"
                    label="Số lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                    <Input placeholder="Nhập số lượng" type="number" />
                </Form.Item>
                <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}
                >
                    <Input placeholder="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc' }]}
                >
                    <Input placeholder="YYYY-MM-DD" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePromotion;
