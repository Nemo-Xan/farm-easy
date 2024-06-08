
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Services from "../../screens/farmer/Services";

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = "Services";

const ServicesStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Services" component={Services} />
    </Stack.Navigator>
  );
};

export default ServicesStack;
