import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import HomeLayout from "../farmer/HomeLayout";
import Icon from "react-native-vector-icons/Ionicons";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import { deleteUser, getLogout } from "../../requests/auth";
import { useDispatch } from "react-redux";
import { ShowToast } from "../../services/toastConfig";
import { authActions } from "../../store/reducers/authSlice";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { images } from "../../constants/images";
import InputField from "../../components/InputField";
import ButtonCustom from "../../components/ButtonCustom";
import Buttons from "../../components/home/Buttons.components";
import OfflineCheck from "../../services/network";
import { useTranslation } from "react-i18next";
import { handleError } from "../../requests";

const DeleteProfile = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const deleteAccount = async () => {

    setError("")
    if (!password) {
      setError(t("Required"))
      ShowToast.error(t("necessaryInfo"))
      return
    }

    if (await OfflineCheck()) {
      ShowToast.error(t("networkError"))
      return
    }
    
    dispatch(loaderActions.setLoading(true));
    deleteUser({password})
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          ShowToast.success(t("accountDeleted"))
          dispatch(authActions.logout())
        } else {
          ShowToast.error(t("incorrectPassword"))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      })
  }

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
        <Text style={styles.headerText}>{t("deleteAccount")}</Text>
        
        <View
          style={{
            flex: 3,
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: normalize(60),
          }}
        >
          <Image
            source={images.pleadingFace}
            style={{ width: normalize(30), height: normalize(30) }}
          />
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              fontSize: normalize(14),
              color: farmerColor.tabBarIconColor,
              marginTop: normalize(16),
              marginHorizontal: normalize(40),
              textAlign: "center"
            }}
          >
            {t("deleteProfileText")}
          </Text>
          
          <View style={{width: "95%", marginVertical: normalize(30)}}>
            <View style={styles.signUpForm}>
              <InputField
                colorAlt={true}
                title={t("enterPassword")}
                value={[password, setPassword]}
                errorMessage={error}
                secureTextEntry
              />
            </View>
            
            <View style={{ 
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginTop: normalize(20) 
            }}>
              <Buttons type="nonrounded" title={t("cancel")} extendedPadding="normal" onClick={() => props.navigation.pop()} color/>
              <Buttons type="nonrounded" title={t("proceed")} extendedPadding="normal" onClick={() => deleteAccount()}/>
            </View>
          </View>
        </View>
        {/* <View style={{flex: 2}} /> */}
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

const settingsTab = (icon, text, handler) => {
  return (
    <TouchableOpacity style={styles.settingsTab} onPress={() => {
      handler && handler()
    }}>
      <MakeIcon name={icon} />
      <Text style={styles.contentText}>{text}</Text>
    </TouchableOpacity>
  );
};
export default DeleteProfile;

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
