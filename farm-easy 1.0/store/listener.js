import { createListenerMiddleware } from "@reduxjs/toolkit";
import { agentActions } from "./reducers/agentSlice";
import { authActions } from "./reducers/authSlice";
import { farmerActions } from "./reducers/farmerSlice";
import { measurementActions } from "./reducers/measurementSlice";
import { notificationActions } from "./reducers/notificationSlice";
import { registerActions } from "./reducers/registerSlice";
import { serviceActions } from "./reducers/serviceSlice";

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: authActions.logout,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(notificationActions.reset())
    listenerApi.dispatch(measurementActions.reset())
    listenerApi.dispatch(registerActions.reset())
    listenerApi.dispatch(serviceActions.reset())
    listenerApi.dispatch(farmerActions.reset())
    listenerApi.dispatch(agentActions.reset())
  }
})

export default listenerMiddleware