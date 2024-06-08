import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Success from "../screens/auth/Success";
import FarmerBottomTab from "./farmer/FarmerBottomTab";
import Notification from "../screens/common/Notification";
import Feedback from "../screens/common/Feedback";
import Settings from "../screens/common/Settings";
import EditProfile from "../screens/common/EditProfile";
import DeleteProfile from "../screens/common/DeleteProfile";
import ContactUs from "../screens/common/ContactUs";
import ChangePassword from "../screens/common/ChangePassword";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "FarmerBottomTab";

export default function AppComponent() {

  return (
    <>
      <Stack.Navigator
        initialRouteName={INITIAL_ROUTE_NAME}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="FarmerBottomTab" component={FarmerBottomTab} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="FeedBack" component={Feedback} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="DeleteProfile" component={DeleteProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
      </Stack.Navigator>
    </>
  );
}
