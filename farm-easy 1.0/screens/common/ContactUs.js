import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import HomeLayout from "../farmer/HomeLayout";
import Icon from "react-native-vector-icons/Ionicons";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import { images } from "../../constants/images";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { authSelectors } from "../../store/reducers/authSlice";

const ContactUs = (props) => {
  const {t} = useTranslation()
  const { country } = useSelector(authSelectors.selectUser);

  const MakeIcon = ({ name }) => {
    return (
      <Icon
        name={name}
        size={normalize(20)}
        style={{
          paddingRight: normalize(15),
          paddingLeft: normalize(10),
          color: farmerColor.tabBarIconColor,
        }}
      />
    );
  };

  const settingsTab = (icon, text, handler) => {
    return (
      <TouchableOpacity style={styles.settingsTab} onPress={() => {
        handler && handler()
      }}>
        <MakeIcon name={icon} />
        <Text style={styles.contentText}>{text}</Text>
        {text === "Language" &&
        <View style={{ flex: 1, alignItems: 'flex-end'}}>
          <Icon
            name="chevron-down-sharp"
            size={normalize(20)}
          />
        </View>
        }
      </TouchableOpacity>
    );
  };

  return (
    <HomeLayout
      showBackIcon={true}
      showLogo={true}
      settings={true}
      showIcon={false}
      gradient
      {...props}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center"}}>
          
          <Image
            source={images.greenHeart}
            style={{ width: normalize(20), height: normalize(20), marginRight: normalize(10) }}
          />
          <Text style={styles.headerText}>{t("contactUs")}</Text>
        </View>
        
        <View style={{ marginTop: normalize(30)}}>
          {settingsTab("call-outline", (country == "NG" ? "+234 818 035 3315": "+255 768 937 123"))}
          {settingsTab("mail-outline", "farmeasy@riceafrika.com")}
        </View>
      </View>
    </HomeLayout>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  contentText: {
    fontFamily: fonts.MontserratMedium,
    fontSize: normalize(14),
    color: farmerColor.tabBarIconColor,
  },
  sectionHeaderText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    color: farmerColor.tabBarIconColor,
  },
  headerText: {
    fontFamily: fonts.MontserratBold,
    fontSize: normalize(20),
    color: farmerColor.tabBarIconColor,
    marginVertical: normalize(15),
    textAlign: "center",
  },
  settingsTab: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: normalize(14),
    marginVertical: normalize(10),
    borderRadius: normalize(10),
    alignItems: "center",
  },
});
