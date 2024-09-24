import axios from "axios";
import { endpoint, token_refresh_URL } from "../constants";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const authAxiosTest = () => {
  const userId = JSON.parse(sessionStorage.getItem("info_user")).user_id;
  const token = cookies.get(`token_iwaki_${userId}`);

  const axiosTest = axios.create({
    baseURL: endpoint,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  axiosTest.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return new Promise((resolve, reject) => {
        const oroginReq = error.config;
        try {
          if (
            error.response.status === 400 ||
            error.response.status === 404 ||
            error.response.status === 500 ||
            error.response.status === 403
          ) {
            reject(new Error(error.response));
          } else if (error.response.status === 401 && error.config) {
            oroginReq._retry = true;
            let refresh = cookies.get(`refresh_iwaki_${userId}`);
            if (refresh) {
              let res = fetch(token_refresh_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  refresh: cookies.get(`refresh_iwaki_${userId}`),
                }),
              })
                .then((res) => console.log(res))
                .then((res) => {
                  oroginReq.headers.Authorization = `Bearer ${res.access}`;
                  return axios(oroginReq);
                })
                .catch((err) => {
                  // Hết hạn cookies refresh
                  sessionStorage.clear();
                  window.location = "/login";
                  cookies.remove(`token_iwaki_${userId}`);
                  cookies.remove(`refresh_iwaki_${userId}`);
                });
              resolve(res);
            }
          }
        } catch (e) {
          localStorage.setItem("error_s", "1");
        }
        return error;
      });
    }
  );
  return axiosTest;
};

export const authAxios = () => authAxiosTest();
