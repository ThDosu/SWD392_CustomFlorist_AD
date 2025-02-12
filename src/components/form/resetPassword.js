import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { resetPassword } from "../../redux/actions/authenticationActions";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";

const ResetPasswordForm = ({ setShowResetPasswordForm }) => {
  const dispatch = useDispatch();
  const {addToast} = useToasts();
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      addToast("Mật khẩu xác nhận không khớp!", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    const userData = {
      email: email,
      newPassword: newPassword,
    };

    dispatch(resetPassword(userData, addToast))
      .then(() => {
        setShowResetPasswordForm(false);
        addToast("Mật khẩu đã được đặt lại thành công!", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        console.error("Reset password error:", error);
      });
  };

  return (
    <Fragment>
      <MetaTags>
        <title>BloomGift | Đặt Lại Mật Khẩu</title>
        <meta name="description" content="Reset password page." />
      </MetaTags>
      <BreadcrumbsItem to="/">Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to="/reset-password">Đặt lại mật khẩu</BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <form onSubmit={handleResetPassword}>
                    <h4>Đặt lại mật khẩu</h4>
                    <input
                      type="password"
                      name="new-password"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      name="confirm-new-password"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="button-box">
                      <button type="submit">
                        <span>Xác nhận</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => history.push("/login-register")}
                      >
                        <span>Quay lại đăng nhập</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

ResetPasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  setShowResetPasswordForm: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
