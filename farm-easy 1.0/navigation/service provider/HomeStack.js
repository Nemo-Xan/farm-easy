import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ServiceLanding from "../../screens/serviceprovider/ServiceLanding";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "ServiceLanding";
const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ServiceLanding" component={ServiceLanding} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
