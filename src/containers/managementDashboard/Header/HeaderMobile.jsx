import { Box, IconButton } from "@mui/material";
import { Col, Menu, Row, Select } from "antd";
import React from "react";
import { optionLanguage } from "../../../data";
import {
  CloseOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logoIwaki from "../../../images/LogoIwaki.svg";
import fileLanguage from "../../../language.json";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const HeaderMobile = ({
  chooseLanguage,
  handleChangeSelectLanguage,
  onClickMenuDashboard,
  valueKeyMenu,
  setShowOverlay,
  showOverlay,
}) => {
  const role_title = sessionStorage.getItem("Role_Title");

  const handleClickOpenModal = () => {
    setShowOverlay(true);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false); // Ẩn lớp overlay khi click vào nó
  };

  const logout_new = (e) => {
    const userId = JSON.parse(sessionStorage.getItem("info_user")).user_id;

    cookies.remove(`token_iwaki_${userId}`);
    cookies.remove(`refresh_iwaki_${userId}`);
    sessionStorage.clear();
    window.location = "/";
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        backgroundColor: "#fff",
        height: "fit-content",
        width: "100%",
      }}
    >
      <Row
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col span={8}>
          <IconButton style={{ marginLeft: 12 }} onClick={handleClickOpenModal}>
            <MenuOutlined />
          </IconButton>
        </Col>
        <Col span={8}>
          <Box
            display="flex"
            borderRadius="3px"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={logoIwaki}
              alt=""
              width="50%"
              style={{ margin: "10px 0" }}
            ></img>
          </Box>
        </Col>
        <Col span={8}>
          {role_title === "APP_MANAGER" && (
            <Select
              value={chooseLanguage}
              onChange={handleChangeSelectLanguage}
              className="optionLanguage"
              style={{
                border: "1px solid #8080808a",
                float: "right",
                marginRight: 20,
                marginTop: 6,
              }}
              suffixIcon={false}
            >
              {optionLanguage.map((item) => (
                <Select.Option
                  className="choose-flag-app"
                  key={item.value}
                  value={item.value}
                >
                  {item.icon}
                </Select.Option>
              ))}
            </Select>
          )}
        </Col>
      </Row>

      {showOverlay && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000000B3", // Màu xám với độ trong suốt
            zIndex: 1000, // Đảm bảo lớp này hiển thị lên trên các thành phần khác
            opacity: 0, // Set the initial opacity
            animation: "fadeIn 0.7s forwards",
          }}
        >
          <Row style={{ height: "100%" }}>
            <Col
              span={10}
              style={{ background: "#868585", position: "relative" }}
            >
              <Row>
                <Col span={24}>
                  <IconButton
                    style={{ float: "right", top: "10px", right: "10px" }}
                    onClick={handleOverlayClick}
                  >
                    <CloseOutlined style={{ color: "#fff" }} />
                  </IconButton>
                </Col>
                <Col span={24}>
                  <Menu
                    mode="inline"
                    className="menu-admin-mobile"
                    onClick={onClickMenuDashboard}
                  >
                    <Menu.Item key="1">
                      <DashboardOutlined style={{ fontSize: "20px" }} />
                      <span>{fileLanguage[chooseLanguage].dashboard}</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <UserOutlined style={{ fontSize: "20px" }} />
                      <span>
                        {fileLanguage[chooseLanguage].user_management}
                      </span>
                    </Menu.Item>
                  </Menu>
                </Col>
              </Row>
              <Menu
                mode="inline"
                className="menu-admin-mobile border-top"
                style={{
                  position: "absolute",
                  bottom: 0, // Ensures it's at the bottom
                  width: "100%",
                }}
              >
                <Menu.Item key="1" onClick={() => logout_new()}>
                  <LogoutOutlined style={{ fontSize: "20px" }} />{" "}
                  <span>{fileLanguage[chooseLanguage].logout}</span>
                </Menu.Item>
              </Menu>
            </Col>
            <Col span={14}></Col>
          </Row>
        </div>
      )}
    </Box>
  );
};

export default HeaderMobile;
