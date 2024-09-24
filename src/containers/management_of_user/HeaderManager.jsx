import {useEffect, useState } from "react";
import { Avatar, Col, Row, Select } from "antd";
import { optionLanguage } from "../../data";
import { Menu, MenuItem } from "@mui/material";
import LogoIwakiIcon from "../../images/LogoIwaki.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { localhost } from "../../server";
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";
import language from "../../language.json";
import Cookies from "universal-cookie";
import { authAxios } from "../../api/axiosClient";
import PropTypes from "prop-types";

const { Option } = Select;
const cookies = new Cookies();

const HeaderManager = ({
  setChooseLanguage,
  chooseLanguage,
  setCheckNoti,
  checkNoti,
  countNotification,
  setCountNotification
}) => {
  const [isAnchorEl, setIsAnchorEl] = useState(null);
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const handleChangeSelectLanguage = (value) => {
    setChooseLanguage(value);
    sessionStorage.setItem("choosedLanguage", value);
  };
  const openLogout = Boolean(isAnchorEl);
  const handleClickPerson = (event) => {
    setIsAnchorEl(event.currentTarget);
  };

  const handleClosePerson = () => {
    setIsAnchorEl(null);
  };

  const logout_new = (e) => {
    const userId = JSON.parse(sessionStorage.getItem("info_user")).user_id
    sessionStorage.clear();
    window.location = "/";
    cookies.remove(`token_iwaki_${userId}`);
    cookies.remove(`refresh_iwaki_${userId}`);
  };

  const fetchCountNotification = () => {
    const FormData = require("form-data");
    let data = new FormData();

    data.append("id_user", inforUser.user_id);
    data.append("user_role", inforUser.user_role);
    data.append("date_now", dayjs().format("YYYY-MM-DD"));

    authAxios()
      .post(`${localhost}/count_notifi`, data)
      .then((res) => {
        setCheckNoti(false);
        setCountNotification(res.data.total_notif);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCountNotification();
  }, []);

  const showNotification = () => {
    setCheckNoti(true);
  };

  const showNumberNotification = () => {
    if(Number(countNotification) < 99) return countNotification
    return "99+"
  }

  return (
    <div style={{ padding: "10px 5% 15px", borderBottom: "6px solid #F8FAFC" }}>
      <Row className="header-file-manager">
        <Col
          span={8}
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "1ch",
          }}
        >
          <img
            className="logoIwakiManager"
            style={{ borderRadius: "0" }}
            src={LogoIwakiIcon}
            alt=""
          />
        </Col>
        <Col
          span={12}
          offset={4}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            columnGap: "2ch",
          }}
        >
          <Select
            value={chooseLanguage}
            onChange={handleChangeSelectLanguage}
            className="optionLanguage"
            style={{ border: "1px solid #8080808a" }}
            suffixIcon={false}
            aria-label="Flag"
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

          <button className="notification" onClick={showNotification} aria-label="btn-notification">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_160_208)">
                <path
                  d="M15 2.5C12.6793 2.5 10.4537 3.42187 8.81279 5.06282C7.17185 6.70376 6.24997 8.92936 
                                6.24997 11.25V15.66C6.25015 15.8539 6.20522 16.0452 6.11872 16.2188L3.97247 20.51C3.86763 20.7197 
                                3.81813 20.9526 3.82866 21.1868C3.83919 21.421 3.90941 21.6485 4.03266 21.8479C4.1559 22.0473 
                                4.32806 22.2119 4.53281 22.326C4.73755 22.4401 4.96807 22.5 5.20247 22.5H24.7975C25.0319 22.5 
                                25.2624 22.4401 25.4671 22.326C25.6719 22.2119 25.8441 22.0473 25.9673 21.8479C26.0905 21.6485 
                                26.1608 21.421 26.1713 21.1868C26.1818 20.9526 26.1323 20.7197 26.0275 20.51L23.8825 16.2188C23.7955 
                                16.0453 23.7502 15.854 23.75 15.66V11.25C23.75 8.92936 22.8281 6.70376 21.1872 5.06282C19.5462 3.42187 
                                17.3206 2.5 15 2.5ZM15 26.25C14.2242 26.2502 13.4674 26.0099 12.8339 25.5622C12.2004 25.1145 11.7212 24.4813 
                                11.4625 23.75H18.5375C18.2787 24.4813 17.7996 25.1145 17.166 25.5622C16.5325 26.0099 15.7757 26.2502 15 26.25Z"
                  fill={checkNoti ? "#0C4DA2" : "#969696"}
                />
              </g>
              <defs>
                <clipPath id="clip0_160_208">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="notification--num">{showNumberNotification()}</span>
          </button>

          <Avatar
            onClick={handleClickPerson}
            style={{
              backgroundColor: "rgba(5, 141, 244, 0.1)",
              color: "#058DF4",
            }}
            icon={<UserOutlined />}
          ></Avatar>
          <Menu
            id="basic-menu-formSelect"
            anchorEl={isAnchorEl}
            open={openLogout}
            style={{ width: "85px", top: 8 }}
            onClose={handleClosePerson}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              style={{ width: "100%", fontFamily: "Lato sans-serif" }}
              className={"menu-user"}
              onClick={() => logout_new()}
            >
              <LogoutIcon style={{ marginRight: "5%" }} />
              {language[chooseLanguage].log_out}
            </MenuItem>
          </Menu>
        </Col>
      </Row>
    </div>
  );
};

HeaderManager.propTypes = {
  setChooseLanguage: PropTypes.func,
  chooseLanguage: PropTypes.string,
  setCheckNoti: PropTypes.func,
  checkNoti: PropTypes.bool,
  countNotification: PropTypes.any,
  setCountNotification: PropTypes.func,
}


export default HeaderManager;
