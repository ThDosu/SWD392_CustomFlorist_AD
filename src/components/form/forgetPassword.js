import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { forgotPassword } from "../../redux/actions/authenticationActions";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useHistory } from "react-router-dom";

const ForgetPasswordForm = ({ setEmail, setShowForgetPasswordForm, setShowResetPasswordForm }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [email, setEmailInput] = useState("");
  const history = useHistory();

  const handleForgetPassword = (e) => {
    e.preventDefault();
  
    dispatch(forgotPassword(email, addToast))
      .then(() => {
        setEmail(email); 
        setShowForgetPasswordForm(false);
        setShowResetPasswordForm(true);
      })
      .catch((error) => {
        console.error("Forget password error:", error);
      });
  };

  return (
    <Fragment>
      <MetaTags>
        <title>BloomGift | Quên Mật Khẩu</title>
        <meta name="description" content="Forgot password page." />
      </MetaTags>
      <BreadcrumbsItem to="/">Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to="/forget-password">Quên mật khẩu</BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <form onSubmit={handleForgetPassword}>
                    <h4>Quên mật khẩu</h4>
                    <input
                      type="email"
                      name="forgot-password-email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                    />
                    <div className="button-box">
                      <button type="submit">
                        <span>Gửi yêu cầu đặt lại mật khẩu</span>
                      </button>
                      <button
                        type="submit"
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

ForgetPasswordForm.propTypes = {
  setEmail: PropTypes.func.isRequired,
  setShowForgetPasswordForm: PropTypes.func.isRequired,
  setShowResetPasswordForm: PropTypes.func.isRequired,
};

export default ForgetPasswordForm;
