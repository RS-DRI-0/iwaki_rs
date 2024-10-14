import { Box, Button, MenuItem } from "@mui/material";
import MenuMui from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import PropTypes from "prop-types";
import Cookies from "universal-cookie";
import { Avatar, Col, Menu, Row, Select } from "antd";
import logoIwaki from "../../../images/LogoIwaki.svg";
import "./style.scss";
import { optionLanguage } from "../../../data";
import fileLanguage from "../../../language.json";

const cookies = new Cookies();

const Header = ({
  chooseLanguage,
  handleChangeSelectLanguage,
  onClickMenuDashboard,
  valueKeyMenu,
}) => {
  const [isAnchorEl, setIsAnchorEl] = useState(null);
  const open = Boolean(isAnchorEl);

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

  const role_title = sessionStorage.getItem("Role_Title");

  const screenWidth = window.innerWidth;
  const checkScreenWidth1024 = screenWidth < 1440;
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

        <Col span={12}>
          <Menu
            mode="horizontal"
            style={{
              flex: 1,
              minWidth: 0,
            }}
            className="menu-admin"
            onClick={onClickMenuDashboard}
          >
            <Menu.Item key="1">
              <span>{fileLanguage[chooseLanguage].dashboard}</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span>{fileLanguage[chooseLanguage].user_management}</span>
            </Menu.Item>
          </Menu>
        </Col>
        {/* ICONS */}
        <Col span={10}>
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
              className="btnInfoUserAdmin"
              style={{ height: "70%", float: "right" }}
              data-screen-1440={checkScreenWidth1024}
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
              <MenuItem
                style={{ width: "100%" }}
                className={"menu-user"}
                onClick={() => logout_new()}
              >
                <LogoutIcon style={{ marginRight: "5%" }} />
                {fileLanguage[chooseLanguage].logout}
              </MenuItem>
            </MenuMui>
          </Box>

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
    </Box>
  );
};

Header.propTypes = {
  chooseLanguage: PropTypes.any,
  handleChangeSelectLanguage: PropTypes.func,
  onClickMenuDashboard: PropTypes.any,
  valueKeyMenu: PropTypes.any,
};

export default Header;
