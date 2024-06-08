import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { normalize } from "../services";
import fonts from "../constants/fonts";
import colors from "../constants/colors";
import { useTranslation } from "react-i18next";

const ButtonCustom = (props) => {
  const { t, i18n } = useTranslation();
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <Text {...props} style={styles.button}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: normalize(5),
    backgroundColor: colors.green,
    padding: normalize(13),
    elevation: 3,
    borderRadius: normalize(15),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    fontSize: normalize(16),
    color: "white",
    fontFamily: fonts.MontserratSemiBold,
    letterSpacing: 1,
  },
});
