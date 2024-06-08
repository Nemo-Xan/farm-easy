import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Constant from "../../constants";
import { normalize } from "../../services";
import AppBar from "./AppBar";

const { Color, Font } = Constant;

const Layout = (props) => {
  return (
    <View style={styles.container}>
      <AppBar />
      {props.children}
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: normalize(20),
  },
});
