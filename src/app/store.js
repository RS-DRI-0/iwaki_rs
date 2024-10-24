import {configureStore} from "@reduxjs/toolkit";
import authReducer from './Reducers/auth'
import getUserInfo from "./Reducers/getUserInfo";
import zoomReducer from './Reducers/getZoomScreen';

export const store = configureStore({
    reducer:{
        auth: authReducer,
        getUserInfo:getUserInfo,
        zoom: zoomReducer,
    }
})