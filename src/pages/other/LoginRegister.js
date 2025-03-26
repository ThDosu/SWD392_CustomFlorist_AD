import {
  loginAccount,
  regenerateOTP,
  registerAccount,
  verifyAccount,
  signInWithGoogle,
} from "../../redux/actions/authenticationActions";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Link, useHistory } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import VerifyAccount from "../../components/modal/verifyAccount";
import ForgetPasswordForm from "../../components/form/forgetPassword";
import ResetPasswordForm from "../../components/form/resetPassword";
import { fetchSellerInfo } from "../../redux/actions/storeActions";
import "./LoginRegister.css";

const LoginRegister = ({ location }) => {
  const publicUrl = "";
  const { pathname } = location;
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [showRegenerateButton, setShowRegenerateButton] = useState(false);
  const [showForgetPasswordForm, setShowForgetPasswordForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && showVerifyButton) {
      setShowVerifyButton(false);
      setShowRegenerateButton(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, showVerifyButton]);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const savedEmail = getCookie("userEmail");
    const savedPassword = getCookie("userPassword");

    if (savedEmail && savedPassword) {
      document.querySelector('input[name="user-email"]').value = savedEmail;
      document.querySelector('input[name="user-password"]').value = savedPassword;
      setRememberMe(true);
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = {
      email: e.target["user-email"].value,
      phone: e.target["user-phone"].value,
      password: e.target["user-password"].value,
      fullname: e.target["user-fullname"].value,
      address: e.target["user-address"].value,
      gender: e.target["user-gender"].value,
      birthday: e.target["user-birthday"].value,
    };

    if (userData.password !== e.target["user-confirm-password"].value) {
      addToast("Mật khẩu xác nhận không khớp!", { appearance: "error", autoDismiss: true });
      return;
    }

    dispatch(registerAccount(userData, addToast))
      .then(() => {
        setEmail(userData.email);
        setCountdown(60);
        setShowVerifyButton(true);
        setShowRegenerateButton(false);
        setRegistrationSuccess(true);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setShowVerifyButton(false);
        setShowRegenerateButton(false);
        setRegistrationSuccess(false);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = {
      email: e.target["user-email"].value,
      password: e.target["user-password"].value,
    };

    dispatch(loginAccount(userData, addToast))
      .then((response) => {
        if (rememberMe) {
          document.cookie = `userEmail=${userData.email}; max-age=31536000; path=/`; // Save for 1 year
          document.cookie = `userPassword=${userData.password}; max-age=31536000; path=/`; // Save for 1 year
        }
        if (response && response.token) {
          const decodedToken = jwtDecode(response.token);
          localStorage.setItem("token", response.token);
          localStorage.setItem("accountID", decodedToken.accountID);
          localStorage.setItem("role", decodedToken.role);
          localStorage.setItem("storeID", decodedToken.storeID);

          if (decodedToken.role === "ROLE_SELLER") {
            // Lưu trữ thông tin seller
            dispatch(fetchSellerInfo(decodedToken.storeID))
              .then((storeData) => {
                console.log("Store data fetch thành công", storeData);
              })
              .catch((error) => {
                console.error("Lỗi fetching store data:", error);
              });
            history.push("/banhang/dashboard");
          } else {
            history.push("/home-fashion");
          }
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  const handleVerifyAccount = (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      otp: e.target["user-otp"].value,
    };

    dispatch(verifyAccount(userData, addToast))
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Verification error:", error);
      });
  };

  const toggleForgetPasswordForm = (e) => {
    e.preventDefault();
    history.push("/forget-password");
  };

  const handleRegenerateOTP = (e) => {
    e.preventDefault();
    setCountdown(60);
    setShowVerifyButton(true);
    setShowRegenerateButton(false);
    dispatch(regenerateOTP(email, addToast))
      .then(() => {
        console.log("OTP regenerated successfully.");
      })
      .catch((error) => {
        console.error("Regenerate OTP error:", error);
      });
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Đăng Nhập</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Đăng Ký</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            {!showForgetPasswordForm && !showResetPasswordForm ? (
                              <form onSubmit={handleLogin}>
                                <input type="text" name="user-email" placeholder="Email" />
                                <input type="password" name="user-password" placeholder="Mật khẩu" />
                                <div className="button-box">
                                  <div className="login-toggle-btn">
                                    <input
                                      type="checkbox"
                                      checked={rememberMe}
                                      onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label className="ml-10">Ghi nhớ tài khoản</label>
                                    <Link onClick={() => history.push("/forget-password")}>Quên mật khẩu?</Link>
                                  </div>
                                  <button type="submit">
                                    <span>Đăng Nhập</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      (window.location.href =
                                        "https://bloomgift.lemonhill-6b585cc3.eastasia.azurecontainerapps.io/oauth2/authorization/google")
                                    }
                                    className="ml-5"
                                  >
                                    Đăng nhập với Google
                                  </button>
                                </div>
                              </form>
                            ) : showForgetPasswordForm ? (
                              <ForgetPasswordForm
                                setEmail={setEmail}
                                setShowForgetPasswordForm={setShowForgetPasswordForm}
                                setShowResetPasswordForm={setShowResetPasswordForm}
                              />
                            ) : (
                              <ResetPasswordForm email={email} setShowResetPasswordForm={setShowResetPasswordForm} />
                            )}
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleRegister}>
                              <input name="user-fullname" placeholder="Họ tên" type="text" required />
                              <input name="user-email" placeholder="Email" type="email" required />
                              <input name="user-phone" placeholder="Số điện thoại" type="tel" required />
                              <input name="user-address" placeholder="Địa chỉ" type="text" required />
                              <div className="gender-birthday-container">
                                <div className="form-group">
                                  <label htmlFor="user-gender">Giới tính</label>
                                  <select id="user-gender" name="user-gender" className="form-control" required>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="user-birthday">Ngày sinh</label>
                                  <input
                                    id="user-birthday"
                                    name="user-birthday"
                                    placeholder="Ngày sinh"
                                    type="date"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <input name="user-password" placeholder="Mật khẩu" type="password" required />
                              <input
                                name="user-confirm-password"
                                placeholder="Xác nhận mật khẩu"
                                type="password"
                                required
                              />
                              {!registrationSuccess && (
                                <div className="button-box">
                                  <button type="submit">
                                    <span>Đăng ký</span>
                                  </button>
                                </div>
                              )}
                            </form>
                            {showVerifyButton && registrationSuccess && (
                              <div className="verify-account-container mt-3">
                                <p>
                                  Bạn cần xác minh tài khoản. Vui lòng nhấn vào nút bên dưới trong {countdown} giây.
                                </p>
                                <Button onClick={handleOpenModal} disabled={countdown === 0}>
                                  Xác thực tài khoản
                                </Button>
                              </div>
                            )}
                            {showRegenerateButton && registrationSuccess && (
                              <div className="regenerate-otp-container mt-3">
                                <p>Bạn chưa nhận được mã OTP? Nhấn vào nút bên dưới để gửi lại.</p>
                                <Button variant="warning" onClick={handleRegenerateOTP}>
                                  Gửi lại OTP
                                </Button>
                              </div>
                            )}
                            <VerifyAccount
                              showModal={showModal}
                              handleCloseModal={handleCloseModal}
                              handleVerifyAccount={handleVerifyAccount}
                              email={email}
                            />
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object,
};

export default LoginRegister;
