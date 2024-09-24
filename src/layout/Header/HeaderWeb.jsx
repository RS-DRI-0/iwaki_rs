/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import "./Header.css";
import { Avatar, Col, Row } from "antd";
import LogoRS from "../../images/LogoRainScaleLogin.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserOutlined } from "@ant-design/icons";
import ModalInfor from "./ModalInfor";
import Cookies from "universal-cookie";
import { authAxios } from "../../api/axiosClient";
import { localhost } from "../../server";
const cookies = new Cookies();
const HeaderWeb = () => {
  const [isAnchorEl, setIsAnchorEl] = useState(null);
  const open = Boolean(isAnchorEl);
  const [isOpenModalInfor, setIsOpenModalInfor] = useState(false);
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"))
  const currentPack = JSON.parse(sessionStorage.getItem("current_pack"))

  const handleClickPerson = (event) => {
    setIsAnchorEl(event.currentTarget);
  };

  const handleClosePerson = () => {
    setIsAnchorEl(null);
  };

  const handleCloseModalInfor = () => {
    setIsOpenModalInfor(false)
  }

  const showTitlePage = () => {
    if (window.location.pathname === "/") {
      return titleOfManageSystem("Thông tin doanh nghiệp");
    } else if (window.location.pathname === "/category-master") {
      return titleOfManageSystem("Danh mục Master");
    } else if (window.location.pathname === "/export-document") {
      return titleOfManageSystem("Tùy chọn mẫu xuất hóa đơn");
    } else if (window.location.pathname === "/invoice") {
      return titleOfManageDocs("Hóa đơn");
    } else if (window.location.pathname === "/statement") {
      return titleOfManageDocs("Sao kê");
    } else if (window.location.pathname === "/history") {
      return titleOfManageDocs("Lịch sử tải lên");
    } else if (window.location.pathname === "/accounting-invoice") {
      return titleOfAccounting("Định khoản hóa đơn");
    } else if (window.location.pathname === "/accounting-statement") {
      return titleOfAccounting("Định khoản sao kê");
    }
  };

  const titleOfManageSystem = (title) => { };

  const titleOfManageDocs = (title) => { };

  const titleOfAccounting = (title) => { };

  useEffect(() => {
    showTitlePage();
  }, []);

  const returnPackageEntry = () => {
    const FormData = require("form-data");
    let data = new FormData();
    if (currentPack !== undefined && currentPack !== null) {
      if (currentPack.op_id !== "") {
        data.append("op_id", parseInt(currentPack.op_id));
        data.append("op_table", currentPack.op_table);
        data.append("user_pair", parseInt(inforUser.user_pair));
        data.append("user_role", inforUser.user_role);
        authAxios()
          .post(`${localhost}/return_pack_entry`, data)
          .then((res) => { })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const returnPackageCheck = (opID, opTable) => {
    const FormData = require("form-data");
    let data = new FormData();
    if (currentPack !== undefined && currentPack !== null) {
      if (currentPack.op_id !== "") {
        data.append("op_id", currentPack.op_id);
        data.append("op_table", currentPack.op_table);
        data.append("user_role", inforUser.user_role);
        authAxios()
          .post(`${localhost}/return_pack_check`, data)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const returnPackageLastCheck = (opID, opTable) => {
    const FormData = require("form-data");
    let data = new FormData();
    if (currentPack !== undefined && currentPack !== null) {
      if (currentPack.pack_id !== "") {

        data.append("pack_id", currentPack.pack_id);
        data.append("user_role", inforUser.user_role);
        authAxios()
          .post(`${localhost}/return_pack_lc`, data)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  const logout_new = (e) => {
    if (inforUser.user_role_title.toUpperCase() === "ENTRY") {
      returnPackageEntry()
    } else if (inforUser.user_role_title.toUpperCase() === "CHECK") {
      returnPackageCheck()
    } else {
      returnPackageLastCheck()
    }

    sessionStorage.clear();
    window.location = "/";
    cookies.remove(`token_iwaki_${inforUser.user_id}`);
    cookies.remove(`refresh_iwaki_${inforUser.user_id}`);
  };

  const handleClickOpenModalInfor = () => {
    setIsOpenModalInfor(true);
    setIsAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        backgroundColor: "#fff",
        height: "fit-content",
        width: "100%",
        // padding: window.screen.availHeight < 800 ? 1 : 2,
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
        <Col span={16}>
          <Box
            display="flex"
            // backgroundColor={colors.primary[400]}
            borderRadius="3px"
            sx={{ justifyContent: "flex-start", paddingLeft: "24px" }}
          >
            <img src={LogoRS} alt="" key={'logo'}></img>
          </Box>
        </Col>

        {/* ICONS */}
        <Col span={8}>
          <Box display="flex" sx={{ float: "right", paddingRight: "24px" }}>
            {/* <IconButton>
              <img src={IconNotification} alt=""></img>
            </IconButton> */}
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
              // endIcon={<ExpandMoreOutlined />}
              className="btnInfoUser"
              style={{ height: "70%", float: "right" }}
            >
              {JSON.parse(sessionStorage.getItem("user_success"))}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={isAnchorEl}
              open={open}
              onClose={handleClosePerson}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                className={"menu-user"}
                onClick={handleClickOpenModalInfor}
              >
                <UserOutlined style={{ marginRight: "5%" }} />
                Thông tin người dùng
              </MenuItem>
              <MenuItem
                style={{ width: "100%" }}
                className={"menu-user"}
                onClick={() => logout_new()}
              >
                <LogoutIcon style={{ marginRight: "5%" }} />
                Log out
              </MenuItem>
            </Menu>
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

export default HeaderWeb;
