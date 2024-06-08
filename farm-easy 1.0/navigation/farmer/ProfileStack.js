import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../../screens/common/Profile";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "Profile";
const ProfileStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
