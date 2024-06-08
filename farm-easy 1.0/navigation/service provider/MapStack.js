import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LandMeasurement from "../../screens/common/LandMeasurement";
import FarmList from "../../screens/common/FarmList";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "LandMeasurement";

const MapStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LandMeasurement" component={LandMeasurement} />
      <Stack.Screen name="FarmList" component={FarmList} />
    </Stack.Navigator>
  );
};

export default MapStack;
