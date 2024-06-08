import { combineReducers } from "@reduxjs/toolkit";
import { reducer as network } from 'react-native-offline'
import authReducer from './authSlice'
import loaderReducer from "./loaderSlice";
import registerReducer from "./registerSlice";
import farmerReducer from "./farmerSlice";
import serviceReducer from "./serviceSlice";
import agentReducer from "./agentSlice"
import locationReducer from "./locationSlice"
import measurementReducer from "./measurementSlice"
import notificationReducer from "./notificationSlice"

export default combineReducers({
    network,
    auth: authReducer,
    agent: agentReducer,
    farmer: farmerReducer,
    loader: loaderReducer,
    service: serviceReducer,
    register: registerReducer,
    location: locationReducer,
    measurement: measurementReducer,
    notification: notificationReducer,
})
