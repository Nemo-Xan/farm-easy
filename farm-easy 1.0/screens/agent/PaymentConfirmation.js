import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import HomeLayout from "../farmer/HomeLayout";
import fonts from "../../constants/fonts";
import { farmerColor } from "../../constants/colors";
import { normalize } from "../../services";
import AnimatedLottieView from "lottie-react-native";
import lottieList from "../../constants/lotties";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { agentActions } from "../../store/reducers/agentSlice";
import { getAllFarmerRequest } from "../../requests/agent";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { authSelectors } from "../../store/reducers/authSlice";
import { userTypes } from "../../constants/users";

const PaymentConfirmation = (props) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const authUser = useSelector(authSelectors.selectAuth);
  const role = authUser.role;

  useEffect(() => {

    getAllFarmerRequest()
      .then((res) => {
        if (res.data.code == 200 && res.data.success)
          dispatch(agentActions.setRequests(res.data.data));
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
      });

    setTimeout(() => {
      // props.navigation.popToTop();
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: role == userTypes.farmer ? "FarmerBottomTab" : "AgentBottomTab" },
          ],
        })
      );
    }, 2500);
  }, []);

  return (
    <HomeLayout gradient={true} {...props} backIconAlt={true} settings={true}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: normalize(40),
          flex: 1,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", width: "80%" }}>
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              textAlign: "center",
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(16),
            }}
          >
            {t("paymentSuccessful")}
          </Text>
        </View>
        <View style={styles.lottieContainter}>
          <AnimatedLottieView
            autoPlay
            source={lottieList.successTick}
            style={styles.lottieItem}
            loop={false}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </HomeLayout>
  );
};

export default PaymentConfirmation;

const styles = StyleSheet.create({
  lottieContainter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieItem: {
    width: normalize(200),
    height: normalize(200),
    marginBottom: normalize(100),
  },
});
