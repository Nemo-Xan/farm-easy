import { useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
} from "react-native";
import React from "react";
import { normalize } from "../../services";
import LottieView from 'lottie-react-native'
import lottieList from "../../constants/lotties";
import { userRoles } from "../../constants/users";
import { useTranslation } from "react-i18next";

const Success = (props) => {
  const { navigation } = props;
  const params = props.route.params
  const {t} = useTranslation()

  useEffect(() => {

    try {
      const agent = params.agent
      setTimeout(() => {
        navigation.popToTop()
        // navigation.navigate("Login", { role: userRoles.agent})
      }, 2500)
    } catch {
      setTimeout(() => {
        navigation.popToTop()
        navigation.navigate("Login", { role: ""})
      }, 2500)
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageMain}
          resizeMode="cover"
          source={require("../../assets/logo1.png")}
        />
      </View>
      <Text style={styles.text}>{t("allSet")}</Text>
      <Text style={styles.text}>{t("successWelcome")}</Text>
      <View style={styles.lottieContainter}>
        <LottieView 
          autoPlay
          source={lottieList.successTick}
          style={styles.lottieItem}
          loop={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gap: {
    margin: normalize(30),
  },
  buttonContainer: {
    width: "60%",
  },
  button: {
    margin: normalize(10),
  },
  textContainer: {
    width: "60%",
  },
  text: {
    letterSpacing: 1,
    fontFamily: "PoppinsSemiBold",
    fontSize: normalize(30),
    color: "#027044",
    textAlign: 'center',
  },

  container: {
    flex: 1,
    padding: normalize(15),
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: normalize(40),
  },
  imageMain: {
    width: normalize(60),
    height: normalize(60),
  },
  lottieContainter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieItem: {
    width: normalize(250),
    height: normalize(250),
    marginBottom: normalize(100)
  }
});

export default Success;
