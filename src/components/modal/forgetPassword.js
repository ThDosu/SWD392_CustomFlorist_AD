import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

const ForgetPassword = ({ showModal, handleCloseModal, handleForgetPassword }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Quên mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleForgetPassword}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="user-email"
              placeholder="Nhập địa chỉ email của bạn"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Gửi yêu cầu
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ForgetPassword.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func,
  handleForgetPassword: PropTypes.func.isRequired,
};

export default ForgetPassword;
