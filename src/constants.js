import { localhost } from "./server";
const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;
export const loginURL = `${localhost}/login_iwaki`;
export const authURL = `${endpoint}/verify_token_login/`;
export const token_refresh_URL = `${localhost}/refresh`;
export const logoutURL = `${endpoint}/logout/`;
export const userInfoURL = `${endpoint}/infor-user/`;
export const forgotPassword = `${endpoint}/forgot_password/`;

export const renewPassURL = (tok) => `${endpoint}/renewpass/${tok}`;

export const getAllImage = `${endpoint}/import-img/`;

export const getListModels = `${endpoint}/list-models/`;
export const getDetailModel = `${endpoint}/detail-model/`;
