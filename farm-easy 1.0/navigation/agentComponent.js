import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AgentBottomTab from "./agent/AgentBottomTab";
import Notification from "../screens/common/Notification";
import Feedback from "../screens/common/Feedback";
import Settings from "../screens/common/Settings";
import PaymentSummary from "../screens/agent/PaymentSummary";
import EditProfile from "../screens/common/EditProfile";
import ServiceProviderList from "../screens/agent/ServiceProviderList";
import PaymentConfirmation from "../screens/agent/PaymentConfirmation";
import DeleteProfile from "../screens/common/DeleteProfile";
import ContactUs from "../screens/common/ContactUs";
import ChangePassword from "../screens/common/ChangePassword";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "AgentBottomTab";

export default function AgentComponents() {
  return (
    <>
      <Stack.Navigator
        initialRouteName={INITIAL_ROUTE_NAME}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AgentBottomTab" component={AgentBottomTab} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="FeedBack" component={Feedback} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="PaymentSummary" component={PaymentSummary} />
        <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation} />
        <Stack.Screen name="ServiceProviderList" component={ServiceProviderList} />
        <Stack.Screen name="DeleteProfile" component={DeleteProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
      </Stack.Navigator>
    </>
  );
}
