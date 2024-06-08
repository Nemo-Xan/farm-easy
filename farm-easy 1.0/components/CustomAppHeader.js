import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { normalize } from "../services";

const CustomAppHeader = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.viewLeft} onPress={() => {
        if (props.customBackHandler) {
          props.customBackHandler()
        } else
          props.navigation.pop()
      }}>
        <Image
          style={styles.image}
          source={require("../assets/icons/arrow-left-s-line.png")}
        />
      </TouchableOpacity>
      <View style={styles.viewRight}>
        <Image style={styles.image} source={require("../assets/logo1.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    justifyContent: "space-between",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
  },

  viewLeft: {
    backgroundColor: "rgb(206, 253, 234)",
    // width: "12%",
    height: normalize(45),
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalize(10),
    elevation: normalize(4),
  },
  viewRight: {
    width: "15%",
    height: normalize(40),
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  font: {
    fontFamily: "Poppins",
  },
  image: {
    // width: "100%",
    // height: "100%",
    width: normalize(40),
    resizeMode: "center",
  },
});

export default CustomAppHeader;
