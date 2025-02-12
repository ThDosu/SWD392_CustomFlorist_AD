import React from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const VerifyAccount = ({ showModal, handleCloseModal, email, handleVerifyAccount }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác Minh Tài Khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleVerifyAccount}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="user-email" className="form-control" value={email} readOnly />
          </div>
          <div className="form-group">
            <label>OTP</label>
            <input type="text" name="user-otp" className="form-control" placeholder="Nhập OTP" required />
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" type="submit">
              Xác Nhận
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

VerifyAccount.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func,
  email: PropTypes.string.isRequired,
  handleVerifyAccount: PropTypes.func.isRequired,
};

export default VerifyAccount;
