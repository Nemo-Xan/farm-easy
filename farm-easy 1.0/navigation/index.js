import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { authSelectors } from "../store/reducers/authSlice";
import AuthComponent from "./authComponent";
import { useSelector } from "react-redux";
import AppComponent from "./appComponent";
import useAuthenticateUser from "../services/useAuthenticateUser";
import { loaderSelectors } from "../store/reducers/loaderSlice";
import ServiceProvider from "./serviceProviderComponent";
import Toast from "react-native-toast-message";
import { StatusBar } from 'expo-status-bar'
import Loader from "../components/Loader";
import AgentComponents from "./agentComponent";
import { userTypes } from "../constants/users";
import useLocation from "../services/useLocation";
import { toastConfig } from "../services/toastConfig";

export default function NavigationComponent() {
  const globalLoader = useSelector(loaderSelectors.selectGlobalLoader)
  const loggedIn = useSelector(authSelectors.selectLoggedIn);
  const userRole = useSelector(authSelectors.selectRole)
  const isAuthenticatingComplete = useAuthenticateUser();
  useLocation()

  if (!isAuthenticatingComplete) return null;

  const selectDashboard = () => {
    if (loggedIn) {
      return (userRole === userTypes.serviceProvider) ?
        <ServiceProvider /> : 
        (userRole === userTypes.agent) ?
        <AgentComponents /> : <AppComponent />
    }
    return null
  }

  return (
    <>
      <Loader visible={globalLoader} />
      <StatusBar backgroundColor={"black"} style={'light'} />
      <NavigationContainer>
        {loggedIn ? selectDashboard() : <AuthComponent />}
      </NavigationContainer>
      <Toast config={toastConfig} visibilityTime={4000} position="top"/>
    </>
  );
}
