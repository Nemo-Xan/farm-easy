import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/auth/Welcome";
import SignUp from "../screens/auth/SignUp";
import Login from "../screens/auth/Login";
import VerifyAccount from "../screens/auth/VerifyAccount";
import ResetPassword from "../screens/auth/ResetPassword";
import WelcomeMessage from "../screens/auth/WelcomeMessage";
import ForgotPasswordPN from "../screens/auth/ForgotPasswordPN";
import VerifyAgentAccount from "../screens/auth/VerifyAgentAccount";
import Success from "../screens/auth/Success";
import BecomeAgent from "../screens/auth/BecomeAgent";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "WelcomeMessage";

export default function AuthComponent() {
  return (
    <>
      <Stack.Navigator
        initialRouteName={INITIAL_ROUTE_NAME}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="WelcomeMessage" component={WelcomeMessage} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
        <Stack.Screen
          name="VerifyAgentAccount"
          component={VerifyAgentAccount}
        />
        <Stack.Screen name="ForgotPasswordPN" component={ForgotPasswordPN} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="BecomeAgent" component={BecomeAgent} />
      </Stack.Navigator>
    </>
  );
}
