import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapStack from "./MapStack";
import HomeStack from "./HomeStack";
import RequestStack from "./RequestStack";
import ProfileStack from "./ProfileStack";
import ServiceScreenOptions from "./ServiceScreenOption";
import ServicesList from "../../screens/serviceprovider/ServicesList";

const NavigationTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "HomeStack";

const ServiceBottomTab = (props) => {
  return (
    <NavigationTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={ServiceScreenOptions}
    >
      {/* <NavigationTab.Screen name="MapStack" component={MapStack} /> */}
      <NavigationTab.Screen name="HomeStack" component={HomeStack} />
      <NavigationTab.Screen name="RequestStack" component={RequestStack} />
      <NavigationTab.Screen name="ServiceList" component={ServicesList} />
      <NavigationTab.Screen name="ProfileStack" component={ProfileStack} />
    </NavigationTab.Navigator>
  );
};

export default ServiceBottomTab;

const styles = StyleSheet.create({});
