import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../../screens/common/Profile";
import Wallet from "../../screens/common/Wallet";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "Profile";
const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Wallet" component={Wallet} />
    </Stack.Navigator>
  );
};

export default ProfileStack;

const styles = StyleSheet.create({});
