import axios from "axios";
import * as actionTypes from "./actionTypes";
import Cookies from "universal-cookie";
import { loginURL } from "../../constants";
import "./auth.css";

const cookies = new Cookies();
export const authX = (data) => {
  return {
    type: actionTypes.AUTH_START,
    payload: data,
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password, loading) => {
  return (dispatch) => {
    loading(true);
    dispatch(authStart());
    axios
      .post(loginURL, {
        user_name: username,
        user_pw: password,
      })
      .then((res) => {
        // localStorage.setItem("check", JSON.parse(res))
        sessionStorage.clear();
        const token = res.data.access_token;
        const refresh = res.data.refresh_token;
        cookies.set(`token_iwaki_${res.data.user_id}`, token);
        cookies.set(`refresh_iwaki_${res.data.user_id}`, refresh);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(60 * 60 * 24 * 15)); // 15d
        if (res.status === 200) {
          sessionStorage.setItem("Status_Login", res.data.message);
          sessionStorage.setItem("Role_Title", res.data.user_role_title);
          sessionStorage.setItem("userId", res.data.user_id);
          sessionStorage.setItem("info_user", JSON.stringify(res.data));
          sessionStorage.setItem("user_success", JSON.stringify(username));
        }

        if (res.status === 201) {
          dispatch(authFail(res.data.message));
        }

        const screenWidth = window.innerWidth;

        if (res.data.user_role_title === "STAFF") {
          window.location = "/";
        } else if (res.data.user_role_title === "ENTRY") {
          if (screenWidth < 930) {
            const userId = JSON.parse(
              sessionStorage.getItem("info_user")
            ).user_id;

            sessionStorage.clear();
            localStorage.clear();
            cookies.remove(`token_iwaki_${userId}`);
            cookies.remove(`refresh_iwaki_${userId}`);
            window.location = "/login";
          } else {
            window.location = "/entry";
          }
        } else if (res.data.user_role_title === "CHECK") {
          if (screenWidth < 930) {
            const userId = JSON.parse(
              sessionStorage.getItem("info_user")
            ).user_id;

            sessionStorage.clear();
            localStorage.clear();
            cookies.remove(`token_iwaki_${userId}`);
            cookies.remove(`refresh_iwaki_${userId}`);
            window.location = "/login";
          } else {
            window.location = "/check";
          }
        } else if (res.data.user_role_title === "LASTCHECK") {
          if (screenWidth < 930) {
            const userId = JSON.parse(
              sessionStorage.getItem("info_user")
            ).user_id;

            sessionStorage.clear();
            localStorage.clear();
            cookies.remove(`token_iwaki_${userId}`);
            cookies.remove(`refresh_iwaki_${userId}`);
            window.location = "/login";
          } else {
            window.location = "/last_check";
          }
        } else if (res.data.user_role_title === "ADMIN") {
          const userId = JSON.parse(
            sessionStorage.getItem("info_user")
          ).user_id;
          sessionStorage.clear();
          localStorage.clear();
          cookies.remove(`token_iwaki_${userId}`);
          cookies.remove(`refresh_iwaki_${userId}`);
          window.location = "/login";
        } else if (res.data.user_role_title === "APP_MANAGER") {
          window.location = "/management";
        } else if (res.data.user_role_title === "CLF") {
          if (screenWidth < 930) {
            const userId = JSON.parse(
              sessionStorage.getItem("info_user")
            ).user_id;

            sessionStorage.clear();
            localStorage.clear();
            cookies.remove(`token_iwaki_${userId}`);
            cookies.remove(`refresh_iwaki_${userId}`);
            window.location = "/login";
          } else {
            window.location = "/entry_classification";
          }
        } else if (res.data.user_role_title === "CHECK_CLF") {
          if (screenWidth < 930) {
            const userId = JSON.parse(
              sessionStorage.getItem("info_user")
            ).user_id;

            sessionStorage.clear();
            localStorage.clear();
            cookies.remove(`token_iwaki_${userId}`);
            cookies.remove(`refresh_iwaki_${userId}`);
            window.location = "/login";
          } else {
            window.location = "/check_classification";
          }
        }
        loading(false);
      })
      .catch((err) => {
        console.log(err);
        loading(false);
        dispatch(authFail(err.response.data.message));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const userId = JSON.parse(sessionStorage.getItem("info_user")).user_id;
    const token = cookies.get(`token_iwaki_${userId}`);
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(authSuccess(token));
    }
  };
};
