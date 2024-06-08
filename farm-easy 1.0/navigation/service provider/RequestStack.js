import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RequestList from "../../screens/serviceprovider/RequestList";
import JobAcceptance from "../../screens/serviceprovider/JobAcceptance";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "RequestList";
const RequestStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RequestList" component={RequestList} />
      <Stack.Screen name="JobAcceptance" component={JobAcceptance} />
    </Stack.Navigator>
  );
};

export default RequestStack;
