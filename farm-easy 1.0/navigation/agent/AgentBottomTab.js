import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import ServicesStack from "./ServicesStack";
import MapStack from "./MapStack";
import ProfileStack from "./ProfileStack";
import AgentScreenOptions from "./AgentScreenOptions";

const NavigationTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "HomeStack";

const AgentBottomTab = (props) => {
  return (
    <NavigationTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={AgentScreenOptions}
    >
      <NavigationTab.Screen name="HomeStack" component={HomeStack} />
      <NavigationTab.Screen name="ServiceStack" component={ServicesStack} />
      <NavigationTab.Screen name="MapStack" component={MapStack} />
      <NavigationTab.Screen name="ProfileStack" component={ProfileStack} />
    </NavigationTab.Navigator>
  );
};

export default AgentBottomTab;
