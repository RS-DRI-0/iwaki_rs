import React, { useEffect, useState } from "react";
import "./ForgotPassword.css";
import { Button, Col, Form, Input, Row, Select } from "antd";
import logoIwaki from "../../images/LogoIwaki.svg";
import iconEmail from "../../images/iconEmail.svg";
import { optionLanguage } from "../../data";
import language from "../../language.json";
import PropTypes from "prop-types";

const { Option } = Select;

const FormRequestPassword = ({ submitRequestLink }) => {
  const [chooseLanguage, setChooseLanguage] = useState("japanese");

  const handleChangeSelectLanguage = (value) => {
    setChooseLanguage(value);
    sessionStorage.setItem("choosedLanguage", value);
  };
  const onClickReturnLogin = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    sessionStorage.setItem("choosedLanguage", "japanese")
  }, []);

  return (
    <div className="ForgotPassword">
      <div className="HeaderForgot">
        <Row>
          <Col
            span={12}
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <img
              className="imgLogoIwakiFG"
              style={{ borderRadius: "0" }}
              src={logoIwaki}
              alt=""
            />
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Select
              value={chooseLanguage}
              onChange={handleChangeSelectLanguage}
              className="optionLanguage"
              style={{ marginRight: "12px", border: "1px solid #8080808a" }}
              suffixIcon={false}
            >
              {optionLanguage.map((item) => (
                <Option
                  className="choose-flag-app"
                  key={item.value}
                  value={item.value}
                >
                  {item.icon}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
      <div className="BodyForgot">
        <div className="titleForgot">
          <span className="textTitleHeader">
            {language[chooseLanguage].forgot_your_password}
          </span>
          <span className="textTitleBody">
            {language[chooseLanguage].content_email_reset_passwork}
          </span>
        </div>
        <div className="FormForgot">
          <Form>
            <Form.Item>
              <Input
                className="inputEmail"
                prefix={
                  <img style={{ borderRadius: "0" }} src={iconEmail} alt="" />
                }
                placeholder={language[chooseLanguage].email_address}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="btnSubmitForgot"
                type="primary"
                htmlType="submit"
                onClick={submitRequestLink}
              >
                <span className="spanBtnSubmit">
                  {language[chooseLanguage].request_reset_link}
                </span>
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="btnBatch">
          <Button
            style={{ border: "none" }}
            className="btnBackLogin"
            onClick={onClickReturnLogin}
          >
            <span className="spanBack">
              {language[chooseLanguage].back_to_login}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

FormRequestPassword.propTypes = {
  submitRequestLink: PropTypes.func,
};

export default FormRequestPassword;
