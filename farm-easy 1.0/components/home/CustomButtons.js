import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { normalize } from "../../services";

import Icon from "react-native-vector-icons/Ionicons";

const CustomButtons = (props) => {
  if (props.type === "1") return <Button1 {...props} />;
  else if (props.type === "2") return <Button2 {...props} />;
  else if (props.type === "3") return <Button3 {...props} />;
  else if (props.type === "4") return <Button4 {...props} />;
  else if (props.type === "5") return <Button5 {...props} />;
  else if (props.type === "6") return <Button6 {...props} />;
  else return <Button1 {...props} />;
};

const Button6 = (props) => {
  console.log(props.navigation);
  return (
    <TouchableOpacity
      onPress={() => props.navigation.navigate("EditProfile")}
      style={StyleSheet.compose(props.style, styles.container6)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          style={{ marginHorizontal: normalize(5), color: colors.white }}
          name="pencil-outline"
          size={normalize(15)}
        />
        <Text {...props} style={styles.button6}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Button5 = (props) => {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(props.style, styles.button5Container)}
    >
      <Text {...props} style={styles.button5}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
const Button4 = (props) => {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(props.style, styles.button4Container)}
    >
      <Text {...props} style={styles.button4}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
const Button3 = (props) => {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.button3Container, props.style)}
      onPress={() => props.onPress || {}}
    >
      <Text {...props} style={styles.button3}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
const Button2 = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate("FeedBack");
      }}
      style={StyleSheet.compose(props.style, styles.buttonGreenContainer)}
    >
      <Text {...props} style={styles.buttonGreen}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const Button1 = (props) => {
  return (
    <TouchableOpacity style={StyleSheet.compose(props.style, styles.container)}>
      <Text {...props} style={styles.button}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButtons;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: normalize(50),
    borderRadius: normalize(5),
    alignSelf: "flex-start",
  },
  button: {
    fontFamily: fonts.MontserratBold,
    color: colors.textGreenButton,
    fontSize: normalize(18),
  },
  buttonGreenContainer: {
    backgroundColor: colors.green,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
  },
  buttonGreen: {
    fontFamily: fonts.MontserratBold,
    color: colors.white,
    fontSize: normalize(14),
  },
  button3: {
    fontFamily: fonts.MontserratBold,
    color: colors.white,
    fontSize: normalize(14),
  },
  button3Container: {
    backgroundColor: colors.green,
    paddingHorizontal: normalize(50),
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
  },
  button4: {
    fontFamily: fonts.MontserratBold,
    color: colors.darkGreen,
    fontSize: normalize(14),
  },
  button4Container: {
    backgroundColor: colors.buttonYellow,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(20),
  },
  button5: {
    fontFamily: fonts.MontserratBold,
    color: colors.white,
    fontSize: normalize(14),
  },
  button5Container: {
    backgroundColor: colors.lime,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(20),
  },
  container6: {
    backgroundColor: colors.green,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    alignSelf: "flex-start",
  },
  button6: {
    fontFamily: fonts.MontserratBold,
    color: colors.white,
    fontSize: normalize(14),
  },
});
