import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { normalize } from "../../services";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import InputField from "../../components/InputField";
import { ShowToast } from "../../services/toastConfig";
import ButtonCustom from "../../components/ButtonCustom";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import Icon from "react-native-vector-icons/Ionicons";
import Constant from "../../constants";
import ScrollViewLayout from "../../components/ScrollViewLayout";
import { postVerifyAgent } from "../../requests/agent";
import { userRoles } from "../../constants/users";
import { farmerColor } from "../../constants/colors";
import OfflineCheck from "../../services/network";
import { useTranslation } from "react-i18next";

const { Color, Font } = Constant;

const initErrors = {
  otpCode: "",
  password: "",
  confirmPassword: "",
}

const VerifyAgentAccount = (props) => {
  const {t} = useTranslation()
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)))

  const customBackHandler = () => {
    ShowToast.error("Please enter otp code before exiting");
  };

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
      tempErrors.otpCode = t("Required");
      errorFound = true
    }

    if (errorFound) {
      ShowToast.error(t("necessaryInfo"))
      setErrors(tempErrors)
      return;
    }

    if (password.length < 4) {
      tempErrors.password = t("increasePassword")
      errorFound = true
    }

    if (password != confirmPassword) {
      tempErrors.confirmPassword = t("passwordMismatch")
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

    setLoader(true);
    postVerifyAgent({
      code: otpCode,
      password,
      password_confirmation: confirmPassword,
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 401) {
          ShowToast.error(t("invalidResetCode"));
        } else if (res.data.success) {
          ShowToast.success(t("verificationSuccessful"));
          props.navigation.popToTop();
          props.navigation.navigate("Login", { role: userRoles.agent });
        }
      })
      .catch((err) => {
        console.log(err.response);
        ShowToast.error(t("networkError"))
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <Layout {...props} customBackHandlerOld={customBackHandler}>
      {loader && <Loader visible={loader} />}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View>
          <Text style={styles.signUpText}>{t("verifyAccount")}</Text>
        </View>
        <View>
          <Text style={styles.signUpTextSub}>{t("agentCode")}</Text>
        </View>
        <View style={styles.otp}>
          <OTPInputView
            pinCount={6}
            codeInputFieldStyle={[styles.inputTileNew, errors.otpCode ? { backgroundColor: farmerColor.errors } : {}]}
            onCodeChanged={(code) => setOtpCode(code)}
          />
        </View>

        
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {errors.otpCode && <Icon
            name="information-circle-outline"
            color={farmerColor.cancelledColor}
            size={normalize(15)}
            style={{
              paddingVertical: normalize(8),
            }}
          />
          }
          <Text style={styles.inputFontSizeError}>{errors.otpCode}</Text>
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
      </ScrollView>
      <View style={styles.button}>
        <ButtonCustom onPress={verify} title={t("proceed")} />
      </View>
    </Layout>
  );
};

export default VerifyAgentAccount;

const styles = StyleSheet.create({
  container: {
    marginVertical: normalize(10),
    flex: 1,
  },

  signUpTextSub: {
    marginVertical: normalize(5),
    marginTop: normalize(30),
    fontFamily: Font.MontserratSemiBold,
    fontSize: normalize(17),
    color: Color.menuBar,
    letterSpacing: 0.5,
  },
  signUpText: {
    marginVertical: normalize(5),
    fontFamily: Font.MontserratSemiBold,
    fontSize: normalize(30),
    color: Color.darkGreen,
    letterSpacing: 1,
  },

  button: {
    marginBottom: normalize(30),
    marginTop: normalize(10),
    width: "60%",
  },

  otp: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: normalize(30),
    marginBottom: normalize(20),
    height: normalize(20),
    marginHorizontal: normalize(4),
  },

  inputTile: {
    backgroundColor: Color.lightGreen,
    width: "14%",
    padding: normalize(13),
    borderRadius: normalize(8),
    textAlign: "center",
    elevation: 1,
    marginHorizontal: normalize(5),
  },

  inputTileNew: {
    backgroundColor: Color.lightGreen,
    // width: "14%",
    fontFamily: Font.MontserratBold,
    padding: normalize(13),
    borderRadius: normalize(8),
    textAlign: "center",
    elevation: 1,
    marginHorizontal: normalize(5),
    borderWidth: 0,
    color: "black",
  },

  inputFontSizeError: {
    fontFamily: Font.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(8),
    color: farmerColor.cancelledColor,
  },
});
