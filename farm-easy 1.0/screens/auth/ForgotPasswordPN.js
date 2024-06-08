import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { normalize, reSize } from "../../services";
import InputField from "../../components/InputField";
import ButtonCustom from "../../components/ButtonCustom";

import Constant from "../../constants";
import { ShowToast } from "../../services/toastConfig";
import Loader from "../../components/Loader";
import { postForgotPassword } from "../../requests/auth";
import OfflineCheck from "../../services/network";
import { useTranslation } from "react-i18next";

const { Color, Font } = Constant;
const ForgotPasswordPN = (props) => {
  const { t } = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("")
  const [loader, setLoader] = useState(false)

  const sendRequest = async () => {
    setError("")
    if (!phoneNumber) {
      setError(t("Required"))
      ShowToast.error(t("necessaryInfo"))
      return
    }

    if (await OfflineCheck()) {
      ShowToast.error(t('networkError'))
      return
    }
    
    setLoader(true)
    postForgotPassword({phone: phoneNumber})
      .then(res => {
        if (!res.data) {
          ShowToast.error(t("phoneNotFound"))
        } else {
          if (res.data.success) {
            ShowToast.success(t("otpSent"))
            props.navigation.navigate("ResetPassword", {phone: phoneNumber})
          }
        }
      })
      .catch(err => {
        console.log(err.response)
        ShowToast.error(t("somethingWentWrong"))
      })
      .finally(() => {
        setLoader(false)
      })
  }
  return (
    <Layout {...props}>
      {loader && <Loader visible={loader} />}
      <View style={styles.container}>
        <View>
          <Text style={styles.signUpText}>{t("forgotPassword")}</Text>
        </View>
        <View>
          <Text style={styles.signUpTextSub}>
            {t("forgotPasswordText")}
          </Text>
        </View>
        <View style={styles.signUpForm}>
          <InputField
            title={t("phoneNumber")}
            value={[phoneNumber, setPhoneNumber]}
            number
            errorMessage={error}
          />
        </View>
        <View style={styles.button}>
          <ButtonCustom
            title={t("proceed")}
            onPress={() =>
              sendRequest()
            }
          />
        </View>
      </View>
    </Layout>
  );
};

export default ForgotPasswordPN;

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
    letterSpacing: 0.5,
  },
  signUpTextSub: {
    marginVertical: normalize(30),
    fontFamily: Font.MontserratSemiBold,
    fontSize: normalize(16),
    letterSpacing: 1,
    color: Color.menuBar,
  },

  signUpForm: {
    marginTop: normalize(10),
  },
  button: {
    marginTop: normalize(30),
    width: "60%",
  },
});
