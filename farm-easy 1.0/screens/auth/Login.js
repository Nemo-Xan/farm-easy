import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { normalize, reSize } from "../../services";
import InputField from "../../components/InputField";
import ButtonCustom from "../../components/ButtonCustom";
import { ShowToast } from "../../services/toastConfig";
import { getProfile, getUser, postLogin } from "../../requests/auth";
import Loader from "../../components/Loader";
import { authActions } from "../../store/reducers/authSlice";
import { useDispatch } from "react-redux";
import { userRoles } from "../../constants/users";

import Constant from "../../constants";
import OfflineCheck from "../../services/network";
import { useTranslation } from "react-i18next";
import translate from "translate-google-api";


const { Color, Font } = Constant;
const initErrors = {
  phone: "",
  password: ""
}

const Login = (props) => {
  const { role } = props.route.params;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation()

  const [phone, setPhone] = useState("");
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)))

  const authenticate = async () => {
    setErrors(JSON.parse(JSON.stringify(initErrors)))
    let tempErrors = JSON.parse(JSON.stringify(initErrors))
    let errorFound = false

    if (!phone) {
      tempErrors.phone = t("required")
      errorFound = true
    }

    if (!password) {
      tempErrors.password = t("required")
      errorFound = true
    }

    if (errorFound) {
      ShowToast.error(t("validInfo"))
      setErrors(tempErrors)
      return;
    }

    if (await OfflineCheck()) {
      ShowToast.error(t("networkError"));
      return;
    }

    setLoader(true);
    postLogin({ phone, password })
      .then(async (res) => {
        console.log(res.data);
        if (res.data.code === 401) {
          let message = res.data.message || res.data.error
          let result = await translate(message, { to: i18n.language})
          if (result.length === 0) result = [res.data.message || res.data.error] 
          ShowToast.error(result[0]);

          if (res.data.message.search("verify") != -1) {
            if (role === userRoles.agent)
              props.navigation.navigate("VerifyAgentAccount");
            else props.navigation.navigate("VerifyAccount");
          }

          setLoader(false);
        } else if (res.data.code === 200) {
          ShowToast.success(t("loginSuccessful"));
          dispatch(authActions.setToken(res.data.data));

          getUser()
            .then((res) => {
              dispatch(authActions.setRole(res.data.data.user_type));
              dispatch(authActions.setUser(res.data.data));

              getProfile().then((res) => {
                dispatch(authActions.setProfile(res.data.data));
                dispatch(authActions.login());
              });
            })
            .catch((err) => {
              console.warn(err.response);
              dispatch(authActions.logout());
              ShowToast.error(t("somethingWentWrong"));
              setLoader(false);
            });
        }
      })
      .catch((err) => {
        console.warn(err.response);
        ShowToast.error(t("networkError"));
        setLoader(false);
      })
      .finally(() => {});
  };

  return (
    <Layout {...props}>
      {loader && <Loader visible={loader} />}
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          onPress={(event) => event.target = event.currentTarget && Keyboard.dismiss(event)}
          keyboardShouldPersistTaps='handled'
        >
          {/* <TouchableWithoutFeedback
            style={{  backgroundColor: "blue" }}
            onPress={(event) => event.target == event.currentTarget && Keyboard.dismiss(event)}
          > */}
            <View style={{ flex: 1 }}>
              <View>
                <Text style={styles.signUpText}>{t("login")}</Text>
              </View>
              <View style={styles.signUpForm}>
                <InputField
                  title={t("phoneNumber")}
                  value={[phone, setPhone]}
                  number
                  errorMessage={errors.phone}
                />
                <InputField
                  title={t("password")}
                  value={[password, setPassword]}
                  secureTextEntry
                  errorMessage={errors.password}
                />
              </View>
            </View>
          {/* </TouchableWithoutFeedback> */}
          
          <View style={styles.button}>
            <ButtonCustom title={t("proceed")} onPress={authenticate} />
          </View>
          
          <View style={styles.extraContainer}>
            <TouchableOpacity
              style={styles.forgetPasswordContainer}
              onPress={() =>
                props.navigation.navigate("ForgotPasswordPN")
              }
            >
              <Text style={styles.forgetPassword}>{t("forgotPassword")}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.forgetPasswordContainer}
              onPress={() => props.navigation.navigate( role==userRoles.agent?"VerifyAgentAccount":"VerifyAccount")}
            >
              <Text style={styles.forgetPassword}>{t("verifyAccount")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {role == userRoles.agent && (
          <View style={[styles.becomeAgent]}>
            <ButtonCustom
              title={t("becomeAgent")}
              onPress={() => props.navigation.navigate("BecomeAgent")}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default Login;

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
  extraContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: normalize(30),
    marginBottom: normalize(10)
  },
  divider: {
    width: 1,
    borderLeftWidth: 1,
    borderLeftColor: Color.green,
    height: "100%",
    marginHorizontal: normalize(20),
  },
  forgetPassword: {
    letterSpacing: 0.2,
    fontFamily: Font.MontserratSemiBoldItalic,
    color: Color.green,
    fontSize: normalize(14),
  },
  forgetPasswordContainer: {
    // paddingTop: normalize(26),
    paddingVertical: normalize(8),
  },
  becomeAgent: {
    marginBottom: normalize(15),
    paddingHorizontal: "5%",
  },
});
