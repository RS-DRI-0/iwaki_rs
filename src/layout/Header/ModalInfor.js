import { useState, useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, Tabs } from "antd";
import { openNotificationSweetAlertAdmin } from "../../Function";
import ErrorIcon from "../../images/ErrorNotifiIcon.svg";
import IconChangePassword from "../../images/mdi_password_outline.svg";
import { localhost } from "../../server";
import PropTypes from "prop-types";
import { authAxios } from "../../api/axiosClient";
import "./Header.css";
import Cookies from "universal-cookie";
import { KeyOutlined } from "@ant-design/icons";
import language from "../../language.json";

const cookies = new Cookies();

const ModalInfor = ({
  isOpenModalInfor,
  handleCloseModalInfor,
  setIsOpenModalInfor,
  chooseLanguage,
}) => {
  const userMSNV = JSON.parse(sessionStorage.getItem("info_user")).user_msnv;

  const [isKeyTab, setIsKeyTab] = useState("1");
  const items = [
    {
      key: "1",
      label: (
        <div style={{ display: "flex" }}>
          <img
            src={IconChangePassword}
            alt=""
            style={{ width: 20, height: 20 }}
          />
          <div style={{ color: "#085FA0", marginLeft: 5 }}>
            {language[chooseLanguage].change_password}
          </div>
        </div>
      ),
    },
  ];

  const onChangeTabsTable = (key) => {
    setIsKeyTab(key);
  };

  const logout_new = (e) => {
    const userId = JSON.parse(sessionStorage.getItem("info_user")).user_id;
    sessionStorage.clear();
    window.location = "/";
    cookies.remove(`token_iwaki_${userId}`);
    cookies.remove(`refresh_iwaki_${userId}`);
  };

  const onFinish = (value) => {
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()])[A-Za-z\d~`!@#$%^&*()]{8,}$/.test(
        value.user_new_pw
      ) === false
    ) {
      openNotificationSweetAlertAdmin(ErrorIcon, "Mật khẩu không hợp lệ.");
    } else {
      authAxios()
        .post(`${localhost}/edit_password`, {
          user_id: inforUser.user_id,
          current_role: inforUser.user_role,
          user_new_pw: value.user_new_pw,
          user_pw: value.user_pw,
        })
        .then((res) => {
          logout_new();
        })
        .catch((err) => {
          if (err.data.message === "Mật khẩu cũ không đúng!") {
            openNotificationSweetAlertAdmin(
              ErrorIcon,
              language[chooseLanguage].the_old_pw_is_incorrect
            );
          } else {
            openNotificationSweetAlertAdmin(ErrorIcon, err.data.message);
          }
        });
    }
  };
  const screenWidth = window.innerWidth;

  const [valueColTabsUser, setValueColTabsUser] = useState(undefined);
  const [valueColTabsUserCol, setValueColTabsUserCol] = useState([]);

  useEffect(() => {
    if (screenWidth > 1650) {
      setValueColTabsUser("left");
      setValueColTabsUserCol([7, 17]);
    } else if (screenWidth > 1024) {
      setValueColTabsUserCol([24, 24]);
      setValueColTabsUser("top");
    } else if (screenWidth <= 1024) {
      setValueColTabsUserCol([24, 24]);
      setValueColTabsUser("top");
    }
  }, [screenWidth]);

  console.log(screenWidth);
  return (
    <Modal
      className="modal-changePW"
      open={isOpenModalInfor}
      closable={false}
      footer={null}
      width={screenWidth >= 1024 ? "50%" : "90%"}
      style={screenWidth >= 1024 ? { marginTop: "10%" } : { marginTop: "23%" }}
    >
      <Row>
        {/* <Col span={24}>
          <IconButton
            style={{ float: "right" }}
            onClick={handleCloseModalInfor}
          >
            <CloseOutlined />
          </IconButton>
        </Col> */}
        <Col
          span={valueColTabsUserCol[0]}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChangeTabsTable}
            tabPosition={valueColTabsUser}
          />
        </Col>
        {/* <Col span={valueColTabsUserCol[1]} > */}
        {/* </Col> */}
      </Row>
      <div style={{ paddingBottom: 10, fontWeight: 700, color: "#626262" }}>
        <KeyOutlined style={{ color: "#1677ff" }} /> ID
        <span style={{ marginLeft: 10 }}>{userMSNV}</span>
      </div>
      <SetPassword
        isOpenModalInfor={isOpenModalInfor}
        onFinish={onFinish}
        setIsOpenModalInfor={setIsOpenModalInfor}
        chooseLanguage={chooseLanguage}
      />
    </Modal>
  );
};

const InforDetail = ({ isOpenModalInfor }) => {
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (isOpenModalInfor) {
      form.setFieldsValue({
        user_fullname: inforUser.user_fullname,
        user_msnv: inforUser.user_msnv,
        user_role_title: inforUser.user_role_title,
        user_center: inforUser.user_center,
      });
    }
  }, [form, inforUser, isOpenModalInfor]);

  return (
    <Form
      form={form}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label="User FullName"
            name="user_fullname"
            className="modal-infor-detail-form-item"
          >
            <Input size="large" disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="ID"
            name="user_msnv"
            className="modal-infor-detail-form-item"
          >
            <Input size="large" disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Role"
            name="user_role_title"
            className="modal-infor-detail-form-item"
          >
            <Input size="large" disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Trung tâm"
            name="user_center"
            className="modal-infor-detail-form-item"
          >
            <Input size="large" disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const SetPassword = ({
  isOpenModalInfor,
  onFinish,
  setIsOpenModalInfor,
  chooseLanguage,
}) => {
  const [form] = Form.useForm();
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [number, setNumber] = useState(false);
  const [lengthString, setLengthString] = useState(false);
  const [specialCharacters, setSpecialCharacters] = useState(false);

  const handleCheckLogicChangePW = (e) => {
    const containsUppercase = /[A-Z]/.test(e.target.value);
    const containsLowercase = /[a-z]/.test(e.target.value);
    const containsNumber = /\d/.test(e.target.value);
    const lengthString = e.target.value.length >= 8;
    const containsSpecialCharacters = /[!@#$%^&*()]/.test(e.target.value);

    setUpperCase(containsUppercase);
    setLowerCase(containsLowercase);
    setNumber(containsNumber);
    setLengthString(lengthString);
    setSpecialCharacters(containsSpecialCharacters);
  };

  useEffect(() => {
    // if (!isOpenModalInfor) {
    setUpperCase(false);
    setLowerCase(false);
    setNumber(false);
    setLengthString(false);
    setSpecialCharacters(false);
    // }
  }, [isOpenModalInfor]);

  const onCancel = () => {
    form.resetFields();
    setIsOpenModalInfor(false);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row>
        <Col span={24} style={{ color: "#626262" }}>
          <Form.Item
            label={language[chooseLanguage].current_password}
            name="user_pw"
            rules={[
              {
                required: true,
                message: `${language[chooseLanguage].please_enter_your_current_password}`,
              },
            ]}
            className="modal-infor-form-item"
          >
            <Input.Password
              size="large"
              placeholder={language[chooseLanguage].current_password}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={language[chooseLanguage].new_password}
            name="user_new_pw"
            rules={[
              {
                required: true,
                message: `${language[chooseLanguage].please_enter_your_new_password}`,
              },
            ]}
            className="modal-infor-form-item"
          >
            <Input.Password
              size="large"
              placeholder={language[chooseLanguage].new_password}
              onChange={handleCheckLogicChangePW}
              maxLength={255}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={language[chooseLanguage].confirm_new_password}
            name="user_new_pw_check"
            className="modal-infor-form-item"
            dependencies={["user_new_pw"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: `${language[chooseLanguage].please_re_enter_your_new_password}`,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("user_new_pw") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      language[
                        chooseLanguage
                      ].confirmation_password_does_not_match
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder={language[chooseLanguage].confirm_new_password}
            />
          </Form.Item>
        </Col>
        <Col span={24} style={{ display: "inline-grid" }}>
          <span data-length-string={lengthString} className="value-check-case">
            * {language[chooseLanguage].a_minimum_of_8_characters}
          </span>
          <span data-upper-case={upperCase} className="value-check-case">
            * {language[chooseLanguage].at_least_1_upper_letter}
          </span>
          <span data-lower-case={lowerCase} className="value-check-case">
            * {language[chooseLanguage].at_least_1_lower_letter}
          </span>
          <span data-number={number} className="value-check-case">
            * {language[chooseLanguage].at_least_1_digit}
          </span>
          <span
            data-special-characters={specialCharacters}
            className="value-check-case"
          >
            * {language[chooseLanguage].at_least_1_digit_special_character}
          </span>
        </Col>
        <Col span={24} className="col-btn-changePW">
          <Button onClick={onCancel} htmlType="button">
            {language[chooseLanguage].close}
          </Button>
          <Button
            // className="btnSubmitModel"
            // type="success"
            type="primary"
            htmlType="submit"
            style={{ background: "#053457" }}
            // loading={loadings}
          >
            {language[chooseLanguage].save}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

SetPassword.propTypes = {
  onFinish: PropTypes.func,
  setIsOpenModalInfor: PropTypes.func,
};

InforDetail.propTypes = {
  isOpenModalInfor: PropTypes.bool,
};

ModalInfor.propTypes = {
  handleCloseModalInfor: PropTypes.func,
  isOpenModalInfor: PropTypes.bool,
};

export default ModalInfor;
