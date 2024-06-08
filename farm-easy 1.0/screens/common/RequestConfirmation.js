import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import HomeLayout from "../farmer/HomeLayout";
import fonts from "../../constants/fonts";
import { farmerColor } from "../../constants/colors";
import { normalize } from "../../services";
import AnimatedLottieView from "lottie-react-native";
import lottieList from "../../constants/lotties";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { agentActions } from "../../store/reducers/agentSlice";
import { getAllFarmerRequest } from "../../requests/agent";
import { images } from "../../constants/images";
import { useTranslation } from "react-i18next";

const RequestConfirmation = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { data } = props.route.params

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
      props.navigation.popToTop();
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
            {
              data.image === images.extension || data.image === images.offtaker ?
              t(`requestConfirmSuccess-special`) + t(data.full) + t("requestSuccess-special") :
              data.quantity ?
              t(`requestConfirmSuccess-quantity`) + t(data.full + ((data.image == images.seed) ? "s":"")) + t("requestSuccess-quantity") :
              t(`requestConfirmSuccess-service`) + t(data.full) + t("requestSuccess-service")
            }
            {
              // data.image === images.extension ? 
              // "You Have Successfully Requested For Extension Service": 
              // data.image === images.offtaker ? "You Have Successfully Requested For An  "+ data.full:
              // data.quantity ?
              // `You Have Successfully Requested For ${data.full + ((data.image == images.seed) ? "s":"")}`:
              // `You Have Successfully Requested For the ${data.full} service`
            }
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

export default RequestConfirmation;

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
