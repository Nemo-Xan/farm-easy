import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import Icon from "react-native-vector-icons/Ionicons";
import imagesList, { ImageObject } from "../../constants/images";
import fonts from "../../constants/fonts";

const backIcon = (
  <Icon
    style={{ margin: normalize(10) }}
    name="chevron-back-outline"
    size={normalize(25)}
  />
);
const settingsIcon = (
  <Icon
    style={{ margin: normalize(10) }}
    name="settings-outline"
    size={normalize(25)}
  />
);
const settingsIconInvinsible = (
  <Icon
    style={{ margin: normalize(10), opacity: 0 }}
    name="settings-outline"
    size={normalize(25)}
  />
);
const notifIcon = (
  <Icon
    style={{ margin: normalize(10) }}
    name="notifications-outline"
    size={normalize(25)}
  />
);
const searchIcon = (
  <Icon
    style={{ margin: normalize(10) }}
    name="search-outline"
    size={normalize(25)}
  />
);
const walletIcon = (
  <Icon
    style={{ margin: normalize(10) }}
    name="wallet-outline"
    size={normalize(25)}
  />
);

const AppBar = (props) => {
  const greenBackground = props.greenBg === true ? styles.green : "";
  const alternateStyle = props.alternate === true ? styles.alternate : "";
  const backStyle = props.backIconAlt === true ? styles.alternate : "";

  return (
    <>
      <View style={[styles.container, alternateStyle, greenBackground]}>
        {!props.removeBack && (
          <TouchableOpacity
            onPress={() => {
              props.navigation.pop() || "";
            }}
            style={[styles.arrowImageContainer, backStyle]}
          >
            {backIcon}
          </TouchableOpacity>
        )}
        {props.image ? (
          ""
        ) : (
          <View>
            <Image source={ImageObject.logo} style={styles.image} />
          </View>
        )}

        {props.text && (
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(18),
            }}
          >
            {props.text}
          </Text>
        )}

        {props.showNotif && props.showIcon === false ? (
          <View>
            {iconMaker(
              notifIcon,
              "Notification",
              props.navigation,
              props.alternate
            )}
          </View>
        ) : (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {props.wallet && (
              <View style={{ marginRight: normalize(10) }}>
                {iconMaker(
                  walletIcon,
                  "Wallet",
                  props.navigation,
                  props.alternate
                )}
              </View>
            )}
            {props.search && (
              <View style={{ marginRight: normalize(10) }}>
                {iconMaker(
                  searchIcon,
                  "Wallet",
                  props.navigation,
                  props.alternate
                )}
              </View>
            )}
            {props.showIcon === false
              ? iconMakerInvinsible(
                  settingsIconInvinsible,
                  "Settings",
                  props.navigation,
                  props.alternate
                )
              : iconMaker(
                  settingsIcon,
                  "Settings",
                  props.navigation,
                  props.alternate
                )}
          </View>
        )}
      </View>
    </>
  );
};

const iconMakerInvinsible = (icon, navigateTo, navigate, alternate) => {
  const alt = alternate ? styles.iconMakerAternate : "";
  return (
    <TouchableOpacity
      style={[styles.iconMakerInvinsible, alt]}
      onPress={() => {
        navigateTo ? navigate.navigate(navigateTo) : "";
      }}
    >
      {icon}
    </TouchableOpacity>
  );
};
const iconMaker = (icon, navigateTo, navigate, alternate) => {
  const alt = alternate ? styles.iconMakerAternate : "";
  return (
    <TouchableOpacity
      style={[styles.iconMaker, alt]}
      onPress={() => {
        navigateTo ? navigate.navigate(navigateTo) : "";
      }}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  green: {
    backgroundColor: farmerColor.backgroundColor,
  },
  alternate: {
    backgroundColor: farmerColor.white,
  },
  iconMaker: {
    backgroundColor: farmerColor.white,
    borderRadius: normalize(10),
    padding: normalize(8),
  },
  iconMakerInvinsible: {
    backgroundColor: farmerColor.backgroundColor,
    borderRadius: normalize(10),
    opacity: 0,
  },
  iconMakerAternate: {
    backgroundColor: farmerColor.backgroundColor,
  },
  image: {
    height: undefined,
    width: normalize(40),
    aspectRatio: 1,
    resizeMode: "center",
  },
  arrowImage: {
    height: normalize(40),
  },
  arrowImageContainer: {
    backgroundColor: farmerColor.backgroundColor,
    borderRadius: normalize(10),
    padding: normalize(8),
  },
});
