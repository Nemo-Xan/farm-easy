import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import CustomAppHeader from "../../components/CustomAppHeader";
import { normalize } from "../../services";
import { userRoles } from "../../constants/users";

import Constant from "../../constants";
import { useTranslation } from "react-i18next";
import fonts from "../../constants/fonts";

const { Color, Font } = Constant;
const Welcome = (props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <CustomAppHeader {...props} />
      <View style={styles.textImageContainer}>
        <Image style={styles.image} source={require("../../assets/rice.png")} />
        <Text style={styles.text}>{t("welcomeMessage")}</Text>
      </View>
      <View style={styles.tileContainer}>
        <Tile
          navigation={props.navigation}
          title={t("Farmer")}
          source={require("../../assets/Farmer.png")}
          role={userRoles.farmer}
        />
        <Tile
          navigation={props.navigation}
          title={t("Service Provider")}
          source={require("../../assets/Officeworker.png")}
          role={userRoles.serviceProvider}
        />
        <Tile
          navigation={props.navigation}
          title={t("Agent")}
          source={require("../../assets/Mechanic.png")}
          role={userRoles.agent}
        />
      </View>
    </View>
  );
};

const Tile = ({ title, source, navigation, role }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (role == userRoles.agent) navigation.navigate("BecomeAgent");
        else navigation.navigate("SignUp", { role });
      }}
      style={styles.tileContent}
    >
      <View style={styles.tileImageContainer}>
        <Image style={styles.tileImage} source={source} />
      </View>
      <Text style={styles.tileText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: normalize(20),
  },
  textImageContainer: {
    paddingTop: normalize(40),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: normalize(60),
    height: normalize(60),
    resizeMode: "contain",
  },

  text: {
    fontFamily: Font.MontserratSemiBold,
    fontSize: normalize(24),
    textAlign: "center",
    color: Color.darkGreen,
  },

  tileContainer: {
    paddingTop: normalize(30),
    flex: 1,
  },
  tileContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.green,
    padding: normalize(15),
    borderRadius: normalize(10),
    marginVertical: normalize(10),
  },
  tileImageContainer: {
    marginRight: normalize(15),
    padding: normalize(5),
    backgroundColor: Color.white,
    borderRadius: normalize(5),
  },
  tileImage: {},
  tileText: {
    color: Color.white,
    marginRight: normalize(10),
    fontSize: normalize(20),
    fontFamily: fonts.MontserratBold
  },
});

export default Welcome;
