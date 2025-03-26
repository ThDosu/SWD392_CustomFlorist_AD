import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Path } from "../../constants/path";
import { loginAccount } from "../../redux/actions/authenticationActions";
import { roles } from "../../types/roles";
import "./LoginRegister.css";

import Logo from "../../assets/fonts/Logo.jpeg";
const Login = () => {
  // eslint-disable-next-line no-undef
  const [redirect, setRedirect] = useState(false);
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
        console.log("res.data", response);

        if (response) {
          setRedirect((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  if (redirect) {
    return <Redirect to={Path.banhang} />;
  }

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `${Logo}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={4} md={6} className="text-center d-flex align-items-center justify-content-center">
            <img src={Logo} alt="Logo" style={{ width: "60%", maxWidth: "300px" }} />
          </Col>

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
                  {/* <Link to="/forget-password" style={{ color: "#7bf2b1", textDecoration: "none" }}>
                    Quên mật khẩu?
                  </Link> */}
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
