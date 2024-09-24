import React, { useState } from "react";
import "./ForgotPassword.css";
import { Button, Col, Form, Row } from "antd";

import logoIwaki from "../../images/LogoIwaki.svg";
import language from "../../language.json";

const FormVerifyPassword = () => {
  // const chooseLanguage = sessionStorage.getItem("choosedLanguage");
  const [chooseLanguage, setChooseLanguage] = useState(
    sessionStorage.getItem("choosedLanguage") !== null &&
      sessionStorage.getItem("choosedLanguage") !== undefined
      ? sessionStorage.getItem("choosedLanguage")
      : "japanese"
  );
  const returnLoginClick = () => {
    window.location.href = "/login";
  };
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
          ></Col>
        </Row>
      </div>
      <div className="BodyForgot">
        <div className="titleForgot">
          <span className="textTitleHeader">
            {language[chooseLanguage].verify_your_email}
          </span>
          <span className="textTitleBody">
            {language[chooseLanguage].content_check_email}
          </span>
        </div>
        <div className="FormForgot">
          <Form className="formVerifyPassword">
            <Form.Item>
              <Button
                className="btnSubmitForgot"
                type="primary"
                htmlType="submit"
                onClick={returnLoginClick}
              >
                <span className="spanBtnSubmit">
                  {language[chooseLanguage].skip_now}
                </span>
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="containerReceiver">
          <span className="snapReceive resendText">
            {language[chooseLanguage].resend_email}
          </span>
          <a className="snapReceive resendLink" href="/">
            {language[chooseLanguage].resend}
          </a>
        </div>
      </div>
    </div>
  );
};
export default FormVerifyPassword;
