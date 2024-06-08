import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Constant from "../../constants";
import fonts from "../../constants/fonts";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import InputField from "../../components/InputField";
import { ShowToast } from "../../services/toastConfig";
import ButtonCustom from "../../components/ButtonCustom";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { postResetPassword } from "../../requests/auth";
import OfflineCheck from "../../services/network";
import { useTranslation } from "react-i18next";
import { handleError } from "../../requests";

const { Color, Font } = Constant;

const initErrors = {
  otpCode: "",
  password: "",
  confirmPassword: "",
}

const ResetPassword = (props) => {
  const { phone } = props.route.params;
  const { t } = useTranslation()

  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)))
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState(false)
  const [otpCode, setOtpCode] = useState("")

  const verify = async () => {
    setErrors(JSON.parse(JSON.stringify(initErrors)))
    let tempErrors = JSON.parse(JSON.stringify(initErrors))
    let errorFound = false
    
    if (!password) {
      tempErrors.password = t("Required")
      errorFound = true
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = t("Required")
      errorFound = true
    }
    if (!otpCode) {
      tempErrors.otpCode = t("Required")
      errorFound = true
    }
    
    if (otpCode && otpCode.length != 6) {
      tempErrors.otpCode = t("Incomplete")
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

    setLoader(true)
    postResetPassword({
      resetCode: otpCode,
      phone,
      password
    })
    .then(res => {
      console.log(res)
      if (res.data.code === 401) {
        ShowToast.error(t("invalidResetCode"))
      } else if (res.data.success) {
        ShowToast.success(t("passwordResetSuccessful"))
        props.navigation.popToTop()
        props.navigation.navigate('Login', {role: ""})
      }
    })
    .catch(handleError)
    .finally(() => {
      setLoader(false)
    })
  }

  return (
    <Layout {...props}>
      {loader && <Loader visible={loader} />}
      <View style={styles.container}>
        <View>
          <Text style={styles.signUpText}>{t("resetPassword")}</Text>
        </View>
        <View style={styles.signUpForm}>
          
        <Text style={styles.inputFontSize}>{t("enterOtp")}</Text>
        <View style={styles.otp}>
          <OTPInputView
            pinCount={6}
            codeInputFieldStyle={[styles.inputTileNew, errors.otpCode ? { backgroundColor: farmerColor.errors } : {}]}
            onCodeChanged={code => setOtpCode(code)}
          />
        </View>
          <InputField
            title={t("newPassword")}
            value={[password, setPassword]}
            secureTextEntry
            errorMessage={errors.password}
          />
          <InputField
            title={t("confirmNewPassword")}
            value={[confirmPassword, setConfirmPassword]}
            secureTextEntry={true}
            errorMessage={errors.confirmPassword}
          />
        </View>
        <View style={styles.button}>
          <ButtonCustom
            title={t("proceed")}
            onPress={verify}
            // onPress={() => props.navigation.navigate("VerifyAccount")}
          />
        </View>
      </View>
    </Layout>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    marginVertical: normalize(10),
    flex: 1,
  },
  signUpText: {
    marginVertical: normalize(5),
    fontFamily: Font.MontserratSemiBold,
    fontSize: normalize(30),
    color: Color.darkGreen,
    letterSpacing: 1,
  },

  signUpForm: {
    marginTop: normalize(30),
  },
  button: {
    marginTop: normalize(30),
    width: "60%",
  },
  otp: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: normalize(20),
    height: normalize(20),
    marginHorizontal: normalize(4)
  },

  inputFontSize: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    marginVertical: normalize(8),
    color: colors.menuBar,
  },
  inputTileNew: {
    backgroundColor: Color.lightGreen,
    // width: "14%",
    fontFamily: Font.MontserratBold,
    padding: normalize(13),
    borderRadius: normalize(8),
    textAlign: "center",
    elevation: 2,
    marginHorizontal: normalize(5),
    borderWidth: 0,
    color: "black",
  },
});
