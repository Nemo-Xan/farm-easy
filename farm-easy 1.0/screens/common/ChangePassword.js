import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import HomeLayout from "../farmer/HomeLayout";
import Icon from "react-native-vector-icons/Ionicons";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import { deleteUser, getLogout, postChangePassword } from "../../requests/auth";
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
import ScrollViewLayout from "../../components/ScrollViewLayout";

const initErrors = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
}

const ChangePassword = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)))

  const changePassword = async () => {

    setErrors(JSON.parse(JSON.stringify(initErrors)))
    let tempErrors = JSON.parse(JSON.stringify(initErrors))
    let errorFound = false

    if (!password) {
      tempErrors.password = t("Required")
      errorFound = true
    }

    if (!oldPassword) {
      tempErrors.oldPassword = t("Required")
      errorFound = true
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = t("Required")
      errorFound = true
    }

    if (errorFound) {
      ShowToast.error(t("necessaryInfo"));
      setErrors(tempErrors)
      return;
    }

    
    if (password.length < 4) {
      tempErrors.password = t("increasePassword")
      errorFound = true
    }

    if (password != confirmPassword) {
      tempErrors.confirmPassword = t("passwordMismatch");
      errorFound = true
    }

    if (errorFound) {
      ShowToast.error(t("validInfo"));
      setErrors(tempErrors)
      return;
    }

    if (await OfflineCheck()) {
      ShowToast.error(t("networkError"))
      return
    }
    
    dispatch(loaderActions.setLoading(true));
    postChangePassword({
      old_password: oldPassword,
      new_password: password
    })
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          ShowToast.success(t("passwordChanged"))
          props.navigation.pop()
          // dispatch(authActions.logout())
        } else {
          ShowToast.error(t("oldPasswordIncorrect"))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      })
  }

  
  const contactUs = () => {
    props.navigation.navigate("ContactUs")
  }

  const rateUs = () => {
    props.navigation.navigate("FeedBack")
  }

  return (
    <HomeLayout
      showBackIcon={true}
      showLogo={true}
      settings={true}
      showIcon={false}
      appbarColor="white"
      // gradient
      {...props}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.headerText}>{t("changePassword")}</Text>
        
        <ScrollViewLayout>
          <View style={{marginTop: normalize(30)}}>
            <InputField
              title={t("oldPassword")}
              value={[oldPassword, setOldPassword]}
              errorMessage={errors.oldPassword}
              secureTextEntry
            />
            <View style={{marginTop: normalize(20)}} />
            <InputField
              title={t("newPassword")}
              value={[password, setPassword]}
              errorMessage={errors.password}
              secureTextEntry
            />
            <View style={{marginTop: normalize(20)}} />
            <InputField
              title={t("confirmNewPassword")}
              value={[confirmPassword, setConfirmPassword]}
              errorMessage={errors.confirmPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.button}>
            <ButtonCustom title={t("proceed")} onPress={changePassword} />
          </View>
          <View>    
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
export default ChangePassword;

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
  button: {
    marginVertical: normalize(30),
    width: "60%",
  },
});
