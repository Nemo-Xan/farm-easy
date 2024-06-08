import { Text, StyleSheet, View, Image } from "react-native";
import React, { Component } from "react";
import CustomAppHeader from "./CustomAppHeader";
import { normalize } from "../services";

const Layout = (props) => {
  return (
    <View style={styles.container}>
      <CustomAppHeader {...props} />
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: normalize(20),
  },
});

export default Layout;
