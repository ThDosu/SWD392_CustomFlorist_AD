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
                      <button type="submit" onClick={() => history.push("/login-register")}>
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

// import React, { Fragment, useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { useDispatch } from "react-redux";
// import { useToasts } from "react-toast-notifications";
// import { forgotPassword, loginAccount } from "../../redux/actions/authenticationActions";
// import MetaTags from "react-meta-tags";
// import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
// import LayoutOne from "../../layouts/LayoutOne";
// import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// import { Link, Redirect, useHistory } from "react-router-dom";
// import { Path } from "../../constants/path";
// import { Container } from "react-bootstrap";
// import { Button, Col, Form, Row } from "antd";
// import { Logo } from "../../assets/fonts/Logo.jpeg";
// const ForgetPasswordForm = () => {
//   // eslint-disable-next-line no-undef
//   const [redirect, setRedirect] = useState(false);
//   const dispatch = useDispatch();
//   const { addToast } = useToasts();
//   const [rememberMe, setRememberMe] = useState(false);
//   const history = useHistory();

//   useEffect(() => {
//     const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) return parts.pop().split(";").shift();
//     };

//     const savedEmail = getCookie("userEmail");
//     const savedPassword = getCookie("userPassword");

//     if (savedEmail && savedPassword) {
//       document.querySelector('input[name="user-email"]').value = savedEmail;
//       document.querySelector('input[name="user-password"]').value = savedPassword;
//       setRememberMe(true);
//     }
//   }, []);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const userData = {
//       email: e.target["user-email"].value,
//     };

//     dispatch(forgotPassword(userData, addToast))
//       .then((response) => {
//         console.log("res.data", response);

//         if (response) {
//           setRedirect((prev) => !prev);
//         }
//       })
//       .catch((error) => {
//         console.error("Login error:", error);
//       });
//   };

//   if (redirect) {
//     return <Redirect to={Path.dangnhap} />;
//   }

//   return (
//     <div
//       className="login-page"
//       style={{
//         backgroundImage: `${Logo}`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Container fluid>
//         <Row className="justify-content-center">
//           <Col lg={4} md={6} className="text-center d-flex align-items-center justify-content-center">
//             <img src={Logo} alt="Logo" style={{ width: "60%", maxWidth: "300px" }} />
//           </Col>

//           <Col lg={4} md={6} className="px-5" style={{ marginRight: "160px" }}>
//             <div className="bg-white p-4 rounded shadow-lg">
//               <h2 className="text-center mb-4" style={{ color: "#7bf2b1" }}>
//                 Quên mật khẩu
//               </h2>
//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3">
//                   <Form.Control type="email" name="user-email" placeholder="Email" required className="py-2" />
//                 </Form.Group>
//                 {/* <Form.Group className="mb-3">
//                   <Form.Control type="password" name="user-password" placeholder="Mật khẩu" required className="py-2" />
//                 </Form.Group> */}
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   {/* <div className="custom-checkbox">
//                     <Form.Check
//                       type="checkbox"
//                       id="rememberMe"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       label="Ghi nhớ đăng nhập"
//                       className="text-muted"
//                     />
//                   </div> */}
//                   <Link to="/login" style={{ color: "#7bf2b1", textDecoration: "none" }}>
//                     Đăng nhập
//                   </Link>
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-100 py-2 mb-3"
//                   style={{ backgroundColor: "#7bf2b1", borderColor: "#1a1a1a" }}
//                 >
//                   Gửi
//                 </Button>
//               </Form>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default ForgetPasswordForm;
