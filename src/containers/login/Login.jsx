import React, { useEffect, useRef } from "react";
import Arrow from "../../images/ArrowIconLogin.svg";
import "./Login.css";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Checkbox, Form, Input } from "antd";
import Cookies from "universal-cookie";
import { authLogin } from "../../app/Actions/auth";
import { connect } from "react-redux";
import logoIwaki from "../../images/LogoIwaki.svg";
import userIcon from "../../images/userIcon.svg";
import passwordIcon from "../../images/passwordIcon.svg";
import alertCircle from "../../images/alertCircle.svg";

const cookies = new Cookies();

function setCookieRemember(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();

  // Mã hóa dữ liệu trước khi lưu vào cookie
  const encodedValue = window.btoa(cvalue); // Mã hóa dữ liệu bằng Base64
  document.cookie = cname + "=" + encodedValue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (const element of cookieArray) {
    let c = element;
    while (c.startsWith(" ")) {
      c = c.substring(1);
    }
    if (c.startsWith(name)) {
      const encodedValue = c.substring(name.length, c.length);
      // Giải mã dữ liệu khi lấy từ cookie
      return window.atob(encodedValue); // Giải mã dữ liệu từ Base64
    }
  }
  return "";
}
class Login extends React.Component {
  state = {
    username: "",
    password: "",
    loadings: false,
    modalVisibleRestPass: false,
    isFocusedUser: false,
    isFocusedPass: false,
    checked: "",
    openModalContact: false,
    openForgetPassword: false,
    openCreateNewPassword: false,
    textAlert: "",
  };

  onChangeRemember = (e) => {
    localStorage.setItem("remember_me", e.target.checked);
    this.setState({
      checked: e.target.checked,
    });
  };

  handleLoading = (value) => {
    this.setState({ loadings: value });
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      username: getCookie("i_u") || "", // Lấy giá trị từ localStorage
      password: getCookie("i_p") || "",
      checked: localStorage.getItem("remember_me") || "",
      textAlert:
        "Your password is not strong enough. Use at least 8 characters",
      // Các trạng thái khác của component
    };
  }

  componentDidMount() {
    // Focus vào input sau khi component được mount
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  render() {
    const { token } = this.props;
    const { username, password } = this.state;
    const { error } = this.props;

    if (token) {
      // localStorage.setItem("currentSelectedKeys", JSON.stringify(['2']))
      return <Redirect to="/login" />;
    }

    const onFinish = (values) => {
      this.props.login(values.username, values.password, (e) =>
        this.handleLoading(e)
      );
      const checkRemember =
        localStorage.getItem("remember_me") !== undefined &&
        localStorage.getItem("remember_me") === "true";
      if (checkRemember === true) {
        setCookieRemember("i_u", values.username, 1);
        setCookieRemember("i_p", values.password, 1);
      } else {
        cookies.remove("i_u");
        cookies.remove("i_p");
        localStorage.setItem("remember_me", false);
      }
    };

    const defaultCheckValue = () =>
      localStorage.getItem("remember_me") === "true";

    return (
      <div className="Login">
        <div className="logoIwakiLogin">
          <img
            className="logoIwakiSVG"
            style={{ borderRadius: "0" }}
            src={logoIwaki}
            alt=""
          />
          <p className="spanSignInTitle">Sign in to your account</p>
        </div>
        <div className="loginForm">
          <Form
            className="formLogin"
            initialValues={{
              username: username || "",
              password: password || "",
            }}
            // form={form}
            name="horizontal_login"
            layout="inline"
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                className="textInputLogin"
                prefix={<img src={userIcon} alt="" />}
                placeholder="Username"
                autoComplete="off"
                ref={this.inputRef} // Gắn ref vào input
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                className="textInputLogin"
                prefix={<img src={passwordIcon} alt="" />}
                // type="password"
                placeholder="Password"
              />
            </Form.Item>
            {error !== null && error !== undefined ? (
              <div className="alertLogin">
                <img className="iconAlertLogin" src={alertCircle} alt="" />
                <span className="textAlertLogin">{error}</span>
              </div>
            ) : null}
            <div className="FooterLoginForm">
              <div className="FooterItemLogin">
                <div className="rememberForgot">
                  <Checkbox
                    defaultChecked={defaultCheckValue}
                    onChange={this.onChangeRemember}
                    className="cbRemeber"
                  >
                    Remember me
                  </Checkbox>
                  <a
                    style={{ border: "none" }}
                    className="linkForgot"
                    href="/forgot-password"
                  >
                    <span className="spanForgot">Forgot your password ?</span>
                  </a>
                </div>
                <div className="signIn">
                  <span className="spanSignIn">Sign in</span>
                  <Button className="btnSignIn" htmlType="submit">
                    <img className="iconArrow" src={Arrow} alt="" />
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  token: PropTypes.any,
  error: PropTypes.any,
  login: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password, loading) =>
      dispatch(authLogin(username, password, loading)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
