import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "../../screens/agent/LandingPage";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "AgentLandingPage";
const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AgentLandingPage" component={LandingPage} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
