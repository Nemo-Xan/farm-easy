import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import { normalize } from "../../services";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Buttons = (props) => {
  return (
    <View>
      {props.type === "nonrounded" ? (
        <ButtonLightGreen {...props} />
      ) : (
        <RoundButton {...props} />
      )}
    </View>
  );
};

const ButtonLightGreen = (props) => {
  let bgStyle, textStyle, redBG, whiteText;
  const paddingType =
    props.extendedPadding === "large"
      ? styles.paddingLarge
      : styles.paddingNormal;

  if (props.headerBtn) {
    bgStyle = styles.bgWhite;
    textStyle = styles.textGreen;
  }

  if (props.color) {
    redBG = styles.redBG;
    whiteText = styles.whiteText;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick ? props.onClick() : "";
      }}
      style={[styles.BLGContainer, paddingType, bgStyle, redBG]}
    >
      <View style={styles.viewContainer}>
        {props.icon && (
          <MaterialCommunityIcons
            style={{ marginHorizontal: normalize(5), color: farmerColor.white }}
            name="pencil-outline"
            size={normalize(15)}
          />
        )}
        <Text style={[styles.text, textStyle, whiteText]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

ButtonLightGreen.propTypes = {
  title: PropTypes.string.isRequired,
  extendedPadding: PropTypes.oneOf(["normal", "large"]).isRequired,
  icon: PropTypes.bool,
};

const RoundButton = (props) => {
  const variant = props.variant;
  let variantBg, variantColor;

  if (variant === 1) {
    variantBg = styles.variant1bg;
    variantColor = styles.variant12color;
  } else if (variant === 2) {
    variantBg = styles.variant2bg;
    variantColor = styles.variant12color;
  } else if (variant === 3) {
    variantBg = styles.variant3bg;
    variantColor = styles.variant34color;
  } else if (variant === 4) {
    variantBg = styles.variant4bg;
    variantColor = styles.variant34color;
  } else if (variant === 5) {
    variantBg = { backgroundColor: farmerColor.tabBarIconColor };
    variantColor = styles.variant34color;
  }

  return (
    <TouchableOpacity
      style={[
        styles.BLGContainer,
        styles.paddingNormal,
        styles.rounded,
        variantBg,
      ]}
      onPress={() => {
        props.onClick ? props.onClick() : "";
      }}
    >
      <View style={styles.viewContainer}>
        <Text style={[styles.text, variantColor]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
RoundButton.prototype = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.number,
};
export default Buttons;

Buttons.prototype = {
  type: PropTypes.oneOf(["rounded", "nonrounded"]).isRequired,
  title: PropTypes.string.isRequired,
  extendedPadding: PropTypes.oneOf(["normal", "large"]).isRequired,
  icon: PropTypes.element,
};

const styles = StyleSheet.create({
  BLGContainer: {
    backgroundColor: farmerColor.lightGreen,
    marginVertical: normalize(10),
    alignSelf: "flex-start",
    borderRadius: normalize(10),
  },

  paddingNormal: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(25),
  },
  paddingLarge: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(50),
  },

  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  redBG: {
    backgroundColor: farmerColor.cancelledColor,
  },

  whiteText: {
    color: "white",
  },

  text: {
    color: farmerColor.white,
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(15),
  },
  textGreen: {
    color: farmerColor.tabBarIconSelectedColor,
    fontSize: normalize(17),
  },
  bgWhite: {
    backgroundColor: farmerColor.white,
    elevation: 2,
    paddingHorizontal: normalize(50),
    paddingVertical: normalize(7),
    borderRadius: normalize(6),
  },

  rounded: {
    borderRadius: normalize(20),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
  },
  variant1bg: {
    backgroundColor: farmerColor.pendingColor,
  },
  variant12color: {
    color: farmerColor.tabBarIconColor,
  },

  variant2bg: {
    backgroundColor: farmerColor.processingColor,
  },

  variant3bg: {
    backgroundColor: farmerColor.approvedColor,
  },
  variant34color: {
    color: farmerColor.white,
  },

  variant4bg: {
    backgroundColor: farmerColor.cancelledColor,
  },
});
