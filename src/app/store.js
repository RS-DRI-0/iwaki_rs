import {configureStore} from "@reduxjs/toolkit";
import authReducer from './Reducers/auth'
import getUserInfo from "./Reducers/getUserInfo";
export const store = configureStore({
    reducer:{
        auth: authReducer,
        getUserInfo:getUserInfo,
    }
})