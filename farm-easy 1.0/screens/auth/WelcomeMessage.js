import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { normalize } from "../../services";
import ButtonCustom from "../../components/ButtonCustom";
import { useDispatch } from "react-redux";
import Constant from "../../constants";
import fonts from "../../constants/fonts";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "../../components/ChangeLanguage";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { Font, Color, ImageList } = Constant;

const WelcomeMessage = (props) => {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false)

  const { navigation } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const displayModal = await AsyncStorage.getItem("show-language-modal")
      // console.log(displayModal)
      if (displayModal == "yes") {
        setShow(true)
      }
    })()
  }, []);

  const callback = async () => {
    await AsyncStorage.setItem("first-load-language", "done")
  }

  return (
    <ImageBackground
      style={styles.image}
      resizeMode="cover"
      source={require("../../assets/fmeapp.png")}
    >
    {show && <ChangeLanguage visible={show} setVisible={setShow} selected="" callback={callback} />}
      <View
        style={{
          position: "absolute",
          top: 0,
        }}
      >
        {/* <SelectDropdown
          data={["en", "fr"]}
          onSelect={(selectedItem, index) => {
            i18n.changeLanguage(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown

            return item;
          }}
          defaultValueByIndex={0}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"black"}
                size={14}
              />
            );
          }}
        /> */}
      </View>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.imageMain}
            resizeMode="cover"
            source={require("../../assets/logo1.png")}
          />
        </View>
        <View style={styles.section}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{t("hi")} 👋</Text>
            <Text style={styles.text}>
              {t("welcome")}
              <Text style={styles.textAccent}>FarmEASY</Text> {t("app")}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonCustom
              title={t("createAccount")}
              onPress={() => navigation.navigate("Welcome")}
            />
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t("haveAccount")}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login", { role: "" })}
              >
                <Text style={styles.registerAccent}> {t("login")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.gap}></View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  gap: {
    margin: normalize(30),
  },
  buttonContainer: {
    // width: "60%",
    paddingHorizontal: normalize(10),
  },
  button: {
    margin: normalize(10),
  },
  textContainer: {
    width: "80%",
  },
  text: {
    letterSpacing: 1,
    fontFamily: Font.MontserratBold,
    fontSize: normalize(30),
    color: Color.deepGreen,
  },

  textAccent: {
    color: "#027044",
  },

  container: {
    flex: 1,
    padding: normalize(15),
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
    width: normalize(70),
    height: normalize(70),
  },
  section: {
    flex: 1,
    justifyContent: "space-evenly",
  },

  registerContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: normalize(20),
  },

  registerText: {
    // marginTop: normalize(16),
    // fontSize: normalize(18),
    fontSize: normalize(18),
    color: Color.deepGreen,
    textAlign: "center",
    fontFamily: fonts.MontserratSemiBold,
  },

  registerAccent: {
    color: Color.green,
    fontFamily: fonts.MontserratBold,
    fontSize: normalize(18),
  },
});

export default WelcomeMessage;
