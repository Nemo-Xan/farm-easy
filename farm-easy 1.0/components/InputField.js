import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { normalize } from "../services";
import { farmerColor } from "../constants/colors";
import fonts from "../constants/fonts";

import Icon from "react-native-vector-icons/Ionicons";

const InputField = ({
  title,
  value,
  secureTextEntry,
  number,
  colorAlt,
  errorMessage,
}) => {
  const [input, setInput] = value;

  const setInputValue = (text) => {
    if (number) {
      if (isNaN(text)) {
        // Its not a number
      } else setInput(text);
    } else {
      setInput(text);
    }
  };

  const inputStyle = colorAlt === true ? styles.inputColorWhite : styles.input;
  const errorBG = errorMessage ? styles.bgError : "";

  return (
    <View style={styles.inputContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[styles.inputFontSize, {maxWidth: "60%"}]}>{title}</Text>
        {errorMessage && (
          <View style={{ flexDirection: "row", alignItems: "center", maxWidth: "40%" }}>
            <Icon
              name="information-circle-outline"
              color={farmerColor.cancelledColor}
              size={normalize(15)}
              style={{
                paddingVertical: normalize(10),
              }}
            />
            <Text style={styles.inputFontSizeError}>{errorMessage}</Text>
          </View>
        )}
      </View>
      <TextInput
        style={[inputStyle, errorBG]}
        autoCapitalize="none"
        placeholderTextColor="white"
        value={input}
        onChangeText={(text) => setInputValue(text)}
        secureTextEntry={secureTextEntry ? true : false}
        keyboardType={number ? "numeric" : "default"}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputFontSize: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    marginVertical: normalize(8),
    color: farmerColor.tabBarIconSelectedColor,
  },
  inputFontSizeError: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(8),
    color: farmerColor.cancelledColor,
    marginLeft: normalize(4),
  },
  input: {
    fontFamily: fonts.MontserratSemiBold,
    padding: normalize(12),
    backgroundColor: farmerColor.lighterGreen,
    borderRadius: normalize(8),
  },
  inputColorWhite: {
    fontFamily: fonts.MontserratSemiBold,
    padding: normalize(12),
    backgroundColor: farmerColor.white,
    borderRadius: normalize(8),
  },
  bgError: { backgroundColor: farmerColor.errors },
});
