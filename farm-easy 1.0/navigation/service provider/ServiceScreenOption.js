import { StyleSheet, Text } from "react-native";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../locale";

const ServiceScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    let icon
    if (route.name === "HomeStack") {
      iconName = focused ? "home" : "home-outline";
    } else if (route.name === "ServiceList") {
      iconName = focused ? "view-grid-plus" : "view-grid-plus-outline";
      icon = (
        <MaterialCommunityIcons
          name={iconName}
          size={size}
          color={farmerColor.tabBarIconSelectedColor}
        /> 
      )
    } else if (route.name === "RequestStack") {
      iconName = focused ? "ios-grid" : "ios-grid-outline";
    } else if (route.name === "ProfileStack") {
      iconName = focused ? "user" : "user-o";
      icon = (
        <FontAwesome
          name={iconName}
          size={size}
          color={farmerColor.tabBarIconSelectedColor}
        /> 
      )
    }

    if (icon) return icon
    
    return (
      <Icon
        name={iconName}
        size={size}
        color={farmerColor.tabBarIconSelectedColor}
      />
    );
  },

  tabBarLabel: (focused, color, position) => {
    let textName;
    if (route.name === "HomeStack") {
      textName = i18n.t("home");
    } else if (route.name === "ServiceList") {
      textName = i18n.t("services");
    } else if (route.name === "RequestStack") {
      textName = i18n.t("requests");
    } else if (route.name === "ProfileStack") {
      textName = i18n.t("profile");
    }
    return (
      <Text
        style={{
          color: farmerColor.tabBarIconColor,
          fontFamily: focused.focused
            ? fonts.MontserratBold
            : fonts.MontserratRegular,
          fontSize: normalize(13),
        }}
      >
        {textName}
      </Text>
    );
  },
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: normalize(20),
    elevation: 0,
    backgroundColor: farmerColor.white,
    left: normalize(20),
    right: normalize(20),
    height: normalize(70),
    borderRadius: normalize(10),

    ...styles.shadow,
  },

  tabBarItemStyle: { paddingVertical: normalize(10) },
  tabBarIconStyle: {},
});

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7f5df0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default ServiceScreenOptions;
