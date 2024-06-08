import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Discover from "../../screens/common/Discover";
import RequestService from "../../screens/common/RequestService";
import RequestConfirmation from "../../screens/common/RequestConfirmation";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "Discover";

const HomeStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Discover" component={Discover} />
      <Stack.Screen name="RequestService" component={RequestService} />
      <Stack.Screen
        name="RequestConfirmation"
        component={RequestConfirmation}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
