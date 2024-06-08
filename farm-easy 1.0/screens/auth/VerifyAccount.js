import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import { normalize } from "../../services";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import InputField from "../../components/InputField";
import { ShowToast } from "../../services/toastConfig";
import { postVerifyAccount } from "../../requests/auth";
import ButtonCustom from "../../components/ButtonCustom";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import Icon from "react-native-vector-icons/Ionicons";
import Constant from "../../constants";
import { farmerColor } from "../../constants/colors";
import { useTranslation } from "react-i18next";

const { Color, Font } = Constant;
let otpCode = "";

const VerifyAccount = (props) => {
  const {t} = useTranslation()
  const [loader, setLoader] = useState(false);
  const [err, setErr] = useState("");

  const customBackHandler = () => {
    ShowToast.error("Please enter otp code before exiting");
  };

  const verify = async ({ code }) => {
    if (code) otpCode = code;

    if (otpCode.length != 6) {
      setErr(t("Required"))
      ShowToast.error(t("necessaryInfo"))
      return;
    }

    setErr("")

    setLoader(true);
    postVerifyAccount({ code: otpCode })
      .then((res) => {
        if (res.data.success) {
          ShowToast.success(t("verificationSuccessful"));
          props.navigation.navigate("Success");
        } else {
          ShowToast.error(res.data.message);
        }
      })
      .catch((e) => {
        console.warn(e);
        ShowToast.error(t("networkError"));
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <Layout {...props} customBackHandlerOld={customBackHandler}>
      {loader && <Loader visible={loader} />}
      <View style={styles.container}>
        <View>
          <Text style={styles.signUpText}>{t("verifyAccount")}</Text>
        </View>
        <View>
          <Text style={styles.signUpTextSub}>
            {t("verifyAccountText")}
          </Text>
        </View>
        <View style={styles.otp}>
          <OTPInputView
            pinCount={6}
            codeInputFieldStyle={!err ? styles.inputTile : styles.inputTileError}
            onCodeFilled={(code) => verify({ code })}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {err && <Icon
            name="information-circle-outline"
            color={farmerColor.cancelledColor}
            size={normalize(15)}
            style={{
              paddingVertical: normalize(8),
            }}
          />
          }
          <Text style={styles.inputFontSizeError}>{err}</Text>
        </View>

        <View style={styles.button}>
          <ButtonCustom onPress={verify} title={t("proceed")} />
        </View>
      </View>
    </Layout>
  );
};

export default VerifyAccount;

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
    marginTop: normalize(30),
    width: "60%",
  },

  otp: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: normalize(10),
    height: normalize(50),
  },

  inputTile: {
    backgroundColor: Color.lightGreen,
    // width: "14%",
    padding: normalize(13),
    borderRadius: normalize(8),
    textAlign: "center",
    elevation: 1,
    marginHorizontal: normalize(5),
    color: "black"
  },
  inputTileError: {
    backgroundColor: farmerColor.errors,
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
    marginLeft: normalize(6)
  },
});
