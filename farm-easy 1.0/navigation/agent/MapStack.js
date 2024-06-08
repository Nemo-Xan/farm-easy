import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandMeasurement from "../../screens/common/LandMeasurement";
import FarmList from "../../screens/common/FarmList";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "LandMeasurement";

const MapStack = () => {
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

const styles = StyleSheet.create({});
