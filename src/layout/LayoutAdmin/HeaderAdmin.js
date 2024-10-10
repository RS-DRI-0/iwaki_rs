import { Box, Button, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Col, Menu, Row, Select } from "antd";
import logoIwaki from "../../images/LogoIwaki.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuMui from "@mui/material/Menu";
import ModalInfor from "./ModalInfor";
import "./style.scss";
import Cookies from "universal-cookie";
import { UserOutlined } from "@ant-design/icons";
import { optionLanguage } from "../../data";

const cookies = new Cookies();
const HeaderAdmin = () => {
  const [isAnchorEl, setIsAnchorEl] = useState(null);
  const open = Boolean(isAnchorEl);
  const [isOpenModalInfor, setIsOpenModalInfor] = useState(false);
  const [chooseLanguage, setChooseLanguage] = useState(
    sessionStorage.getItem("choosedLanguage") !== null
      ? sessionStorage.getItem("choosedLanguage")
      : "japanese"
  );

  const handleClickPerson = (event) => {
    setIsAnchorEl(event.currentTarget);
  };

  const handleClosePerson = () => {
    setIsAnchorEl(null);
  };

  const logout_new = (e) => {
    const userId = JSON.parse(sessionStorage.getItem("info_user")).user_id;

    cookies.remove(`token_iwaki_${userId}`);
    cookies.remove(`refresh_iwaki_${userId}`);
    sessionStorage.clear();
    window.location = "/";
  };

  const defaultSelectedKeys = [
    (window.location.pathname === "/management" && "1") ||
      (window.location.pathname === "/user" && "2"),
  ];

  const handleClickOpenModalInfor = () => {
    setIsOpenModalInfor(true);
    setIsAnchorEl(null);
  };

  const role_title = sessionStorage.getItem("Role_Title");

  const handleCloseModalInfor = () => {
    setIsOpenModalInfor(false);
  };

  const handleChangeSelectLanguage = (value) => {
    setChooseLanguage(value);
    sessionStorage.setItem("choosedLanguage", value);
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
      {/* SEARCH BAR */}
      <Row
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col span={2}>
          <Box
            display="flex"
            borderRadius="3px"
            sx={{ justifyContent: "flex-start", paddingLeft: "24px" }}
          >
            <img src={logoIwaki} alt="" width="90%"></img>
          </Box>
        </Col>

        <Col span={16}>
          <Menu
            mode="horizontal"
            style={{
              flex: 1,
              minWidth: 0,
            }}
            className="menu-admin"
            defaultSelectedKeys={defaultSelectedKeys}
          >
            {role_title === "APP_MANAGER" && (
              <Menu.Item key="1">
                <span></span>
                <Link to="/management"></Link>
              </Menu.Item>
            )}

            {role_title === "ADMIN" && (
              <Menu.Item key="2">
                <span></span>
                <Link to="/user"></Link>
              </Menu.Item>
            )}

            {/* <Menu.Item key="3">Master</Menu.Item>
            <Menu.Item key="4">Status</Menu.Item>
            <Menu.Item key="5">PFM</Menu.Item> */}
          </Menu>
        </Col>
        {/* ICONS */}
        <Col span={2}>
          {role_title === "APP_MANAGER" && (
            <Select
              value={chooseLanguage}
              onChange={handleChangeSelectLanguage}
              className="optionLanguage"
              style={{ border: "1px solid #8080808a", float: "right" }}
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
        <Col span={4}>
          <Box display="flex" sx={{ float: "right", paddingRight: "24px" }}>
            <Button
              variant="outlined"
              onClick={handleClickPerson}
              startIcon={
                <Avatar
                  style={{
                    backgroundColor: "rgba(5, 141, 244, 0.1)",
                    color: "#058DF4",
                  }}
                >
                  {JSON.parse(sessionStorage.getItem("user_success")).substr(
                    0,
                    1
                  )}
                </Avatar>
              }
              className="btnInfoUser"
              style={{ height: "70%", float: "right" }}
            >
              {JSON.parse(sessionStorage.getItem("user_success"))}
            </Button>
            <MenuMui
              id="menu-appbar"
              anchorEl={isAnchorEl}
              keepMounted
              open={open}
              onClose={handleClosePerson}
            >
              {role_title !== "APP_MANAGER" && (
                <MenuItem
                  className={"menu-user"}
                  onClick={handleClickOpenModalInfor}
                >
                  <UserOutlined style={{ marginRight: "5%" }} />
                  Thông tin người dùng
                </MenuItem>
              )}
              <MenuItem
                style={{ width: "100%" }}
                className={"menu-user"}
                onClick={() => logout_new()}
              >
                <LogoutIcon style={{ marginRight: "5%" }} />
                Log out
              </MenuItem>
            </MenuMui>
          </Box>
        </Col>
      </Row>
      <ModalInfor
        isOpenModalInfor={isOpenModalInfor}
        handleCloseModalInfor={handleCloseModalInfor}
      />
    </Box>
  );
};

export default HeaderAdmin;
