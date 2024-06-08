import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Discover from "../../screens/common/Discover";
import RequestConfirmation from "../../screens/common/RequestConfirmation";
import RequestService from "../../screens/common/RequestService";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "Discover";

const ServicesStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="ServiceList" component={ServiceList} /> */}
      <Stack.Screen name="Discover" component={Discover} />
      <Stack.Screen name="RequestService" component={RequestService} />
      <Stack.Screen
        name="RequestConfirmation"
        component={RequestConfirmation}
      />
      {/* <Stack.Screen
        name="ServiceListProvider"
        component={ServiceProviderList}
      /> */}
    </Stack.Navigator>
  );
};

export default ServicesStack;

const styles = StyleSheet.create({});
