import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useToasts } from "react-toast-notifications";
import { loginAccount } from "../../redux/actions/authenticationActions";
import { fetchSellerInfo } from "../../redux/actions/storeActions";
import "./LoginRegister.css";

const Login = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();

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
          localStorage.setItem("role", decodedToken.role);
          localStorage.setItem("storeID", decodedToken.storeID);

          if (decodedToken.role === "ROLE_SELLER") {
            dispatch(fetchSellerInfo(decodedToken.storeID))
              .then((storeData) => {
                console.log("Store data fetch thành công", storeData);
              })
              .catch((error) => {
                console.error("Lỗi fetching store data:", error);
              });
            history.push("/banhang/shop-profile");
          }
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/bloom-gift-67f83.appspot.com/o/element-layout%2Flogo%2Fbanner-authen-seller.png?alt=media&token=d2e8f34e-6f92-4ef7-b5b0-fc2ddb17b478')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container fluid>
        <Row className="justify-content-end row">
          <Col lg={4} md={6} className="px-5" style={{ marginRight: "160px" }}>
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-center mb-4" style={{ color: "#7bf2b1" }}>
                Đăng Nhập
              </h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Control type="email" name="user-email" placeholder="Email" required className="py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" name="user-password" placeholder="Mật khẩu" required className="py-2" />
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="custom-checkbox">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      label="Ghi nhớ đăng nhập"
                      className="text-muted"
                    />
                  </div>
                  <Link to="/forget-password" style={{ color: "#7bf2b1", textDecoration: "none" }}>
                    Quên mật khẩu?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-100 py-2 mb-3"
                  style={{ backgroundColor: "#7bf2b1", borderColor: "#1a1a1a" }}
                >
                  Đăng Nhập
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
