import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { normalize } from "../services";
import SelectDropdown from "react-native-select-dropdown";
import { farmerColor } from "../constants/colors";
import Icon from "react-native-vector-icons/Ionicons";
import fonts from "../constants/fonts";

const DropDownCountry = forwardRef((props, ref) => {
  const [selectedItem, setSelectedItem] = useState("");
  const { errorMessage, title } = props

  const errorBG = errorMessage ? {...styles.dropdown1BtnStyle, backgroundColor: farmerColor.errors} : styles.dropdown1BtnStyle;

  useImperativeHandle(ref, () => {
    return {
      selctedItem: selectedItem,
    };
  });
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.inputFontSize}>{title}</Text>
        {errorMessage && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="information-circle-outline"
              color={farmerColor.cancelledColor}
              size={normalize(15)}
              style={{
                paddingVertical: normalize(8),
              }}
            />
            <Text style={styles.inputFontSizeError}>{errorMessage}</Text>
          </View>
        )}  
      </View>
      <SelectDropdown
        data={props.data}
        onSelect={(selectedItem, index) => {
          props.setCountry(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected

          if (props.type === "countries") {
            return selectedItem.country_code;
          } else if (props.type === "cropType") {
            return selectedItem.farm;
          } else if (props.type === "serviceType") {
            return selectedItem.service;
          }

          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown

          if (props.type === "countries") {
            return item.country_code + " " + item.country;
          } else if (props.type === "cropType") {
            return item.farm;
          } else if (props.type === "serviceType") {
            return item.service;
          }

          return item;
        }}
        buttonStyle={errorBG}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        defaultButtonText=" "
        dropdownStyle={styles.dropdownStyle}
        selectedRowTextStyle={styles.selcetedRowTextStyle}
        rowTextStyle={styles.rowTextStyle}
        search={props.searchable === "true" ? true : ""}
        searchPlaceHolder="Search Country"
        renderDropdownIcon={(isOpened) => {
          return (
            <Icon
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={farmerColor.tabBarIconColor}
              size={normalize(18)}
            />
          );
        }}
      />
    </View>
  );
});

export default DropDownCountry;

const styles = StyleSheet.create({
  rowTextStyle: {
    fontFamily: "Poppins",
    textAlign: "left",
    fontSize: normalize(16),
    paddingHorizontal: normalize(10),
  },
  selcetedRowTextStyle: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
  },
  inputFontSize: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    marginVertical: normalize(8),
    color: farmerColor.tabBarIconSelectedColor,
  },
  dropdownStyle: {
    backgroundColor: "white",
    borderRadius: normalize(8),
    paddingHorizontal: normalize(10),
    elevation: 2,
  },
  dropdown1BtnStyle: {
    width: "100%",
    fontFamily: fonts.MontserratSemiBold,
    padding: normalize(10),
    backgroundColor: farmerColor.lighterGreen,
    elevation: 1,
    borderRadius: normalize(8),
  },
  dropdown1BtnTxtStyle: {
    color: "black",
    marginVertical: normalize(4),
    textAlign: "left",
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
  },
  inputFontSizeError: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(8),
    color: farmerColor.cancelledColor,
    marginLeft: normalize(4)
  },
  bgError: { backgroundColor: farmerColor.errors },
});
