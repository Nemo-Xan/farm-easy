import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import HomeLayout from "../farmer/HomeLayout";
import Icon from "react-native-vector-icons/Ionicons";
import { normalize } from "../../services";
import { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import { getLogout } from "../../requests/auth";
import { useDispatch } from "react-redux";
import { ShowToast } from "../../services/toastConfig";
import { authActions } from "../../store/reducers/authSlice";
import { loaderActions } from "../../store/reducers/loaderSlice";
import ChangeLanguage from "../../components/ChangeLanguage";
import { useTranslation } from "react-i18next";
import ScrollViewLayout from "../../components/ScrollViewLayout";

const Settings = (props) => {
  const {t, i18n} = useTranslation()
  const dispatch = useDispatch()
  const [languageModal, setLanguageModal] = useState(false)

  const logout = async (param) => {

    dispatch(loaderActions.setLoading(true))
    getLogout()
      .then(res => {
        if (res.data.success) {
          dispatch(authActions.logout())
          ShowToast.success(t("logoutSuccessful"))
          dispatch(loaderActions.setLoading(false))
        }
      })
      .catch(err => {
        console.log(err)
        console.log(err.message)
        ShowToast.error(t("networkError"))
        dispatch(loaderActions.setLoading(false))
      })
  }

  const contactUs = () => {
    props.navigation.navigate("ContactUs")
  }

  const changePassword = () => {
    props.navigation.navigate("ChangePassword")
  }

  const toNotification = () => {
    props.navigation.navigate("Notification")
  }

  const changeLanguage = () => {
    setLanguageModal(true)
  }

  const rateUs = () => {
    props.navigation.navigate("FeedBack")
  }

  const settingsTab = (icon, text, handler) => {
    return (
      <TouchableOpacity style={styles.settingsTab} onPress={() => {
        handler && handler()
      }}>
        <MakeIcon name={icon} />
        <Text style={styles.contentText}>{text}</Text>
        {text === t("language") &&
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
      appbarColor="white"
      alternate={true}
      {...props}
    >
      <View style={{flex: 1}}>
        {languageModal && <ChangeLanguage visible={languageModal} setVisible={setLanguageModal} selected={i18n.language} />}
        <Text style={styles.headerText}>{t("settings")}</Text>

        <ScrollViewLayout>
          <Text style={styles.sectionHeaderText}>{t("general")}</Text>
          <View>
            {/* {settingsTab("person-outline", "Account")} */}
            {settingsTab("globe-outline", t("language"), changeLanguage)}
            {settingsTab("key-outline", t("security"), changePassword)}
            {settingsTab("notifications-outline", t("notifications"), toNotification)}
            {settingsTab("log-out-outline", t("logOut"), logout)}
            {settingsTab("trash-outline", t("deleteAccount"), () => props.navigation.navigate("DeleteProfile"))}
          </View>
          <View
            style={{
              marginVertical: normalize(40),
              borderBottomColor: farmerColor.tabBarIconColor,
              borderBottomWidth: 1,
            }}
          />

          <Text style={styles.sectionHeaderText}>{t("feedback")}</Text>
          <View>
            {settingsTab("chatbubble-outline", t("contactUs"), contactUs)}
            {settingsTab("star-outline", t("rateUs"), rateUs)}
          </View>
        </ScrollViewLayout>
      </View>
    </HomeLayout>
  );
};

const MakeIcon = ({ name }) => {
  return (
    <Icon
      name={name}
      size={normalize(20)}
      style={{
        paddingRight: normalize(15),
        color: farmerColor.tabBarIconColor,
      }}
    />
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(14),
    color: farmerColor.tabBarIconColor,
  },
  sectionHeaderText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    color: farmerColor.tabBarIconColor,
  },
  headerText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(20),
    color: farmerColor.tabBarIconColor,
    marginVertical: normalize(15),
    textAlign: "center",
  },
  settingsTab: {
    flexDirection: "row",
    backgroundColor: farmerColor.backgroundColor,
    padding: normalize(14),
    marginVertical: normalize(10),
    borderRadius: normalize(10),
    alignItems: "center",
  },
});
