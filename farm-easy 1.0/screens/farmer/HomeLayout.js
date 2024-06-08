import { StyleSheet, View } from "react-native";
import React from "react";
import { normalize } from "../../services";
import AppBar from "../../components/home/AppBar";
import { farmerColor } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";

const HomeLayout = (props) => {
  const gradient = props.gradient;
  const appBarColor =
    props.appbarColor === "white" ? styles.white : styles.green;

  if (gradient === true) {
    return (
      <LinearGradient
        colors={[farmerColor.backgroundColor, farmerColor.bgBlue]}
        style={[styles.container, appBarColor]}
      >
        {props.showAppBar === false ? "" : <AppBar {...props} />}
        {props.children}
      </LinearGradient>
    );
  } else {
    return (
      <View style={[styles.container, appBarColor]}>
        {props.showAppBar === false ? "" : <AppBar {...props} />}
        {props.children}
      </View>
    );
  }
};

export default HomeLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: farmerColor.backgroundColor,
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
  },
  white: {
    backgroundColor: farmerColor.white,
  },
});
