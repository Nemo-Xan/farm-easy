import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Constant from "../../constants";
import fonts from "../../constants/fonts";
import { isEmail, normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import InputField from "../../components/InputField";
import { ShowToast } from "../../services/toastConfig";
import ButtonCustom from "../../components/ButtonCustom";
import Icon from "react-native-vector-icons/Ionicons";
import locations, { countries } from "../../constants/locations";
import SelectDropdown from "react-native-select-dropdown";
import OfflineCheck from "../../services/network";
import { postBecomeAgent } from "../../requests/agent";
import ScrollViewLayout from "../../components/ScrollViewLayout";
import { useTranslation } from "react-i18next";
import translate from "translate-google-api";
import Sentry from "../../services/useSentry";
import { handleError } from "../../requests";
import { getCountries } from "../../requests/auth";

const { Color, Font } = Constant;

const initErrors = {
  email: '',
  location: '',
  name: '',
  phone: '',
  password: "",
  confirmPassword: "",
  country: ''
}

const BecomeAgent = (props) => {
  const { t, i18n } = useTranslation()

  const [loader, setLoader] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState({}); 
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)))
  const [locationList, setLocationList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        const res = await getCountries();
        if (res.data) setCountryCodes(res.data.data);

        setLoader(false);
      } catch (e) {
        console.warn(e);
        setLoader(false);
        ShowToast.error(t("networkError"))
      }
    };

    fetchData();
  }, []);

  const verify = async () => {
    setErrors(JSON.parse(JSON.stringify(initErrors)))
    let tempErrors = JSON.parse(JSON.stringify(initErrors))
    let errorFound = false

    if (!location) {
      tempErrors.location = t("required")
      errorFound = true
    }
    
    if (!country.name) {
      tempErrors.country = t("required")
      errorFound = true
    }

    if (!phone) {
      tempErrors.phone = t("required")
      errorFound = true
    }

    if (!name) {
      tempErrors.name = t("required")
      errorFound = true
    }

    if (!email) {
      tempErrors.email = t("required")
      errorFound = true
    }
    
    if (!password) {
      tempErrors.password = t("Required")
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
      tempErrors.confirmPassword = t("passwordMismatch")
      errorFound = true
    }

    if (email) {
      if (!isEmail(email)) {
        tempErrors.email = t("invalidFormat")
        errorFound = true
      }
    }

    if (errorFound) {
      ShowToast.error(t("validInfo"));
      setErrors(tempErrors)
      return;
    }

    const code = countryCodes.find(obj => obj.country == country.code)
    const body = {
      location,
      email,
      name,
      phone,
      country: country.code,
      country_code: code.country,
      password
    }

    if (await OfflineCheck()) {
      ShowToast.error(t("networkError"))
      return
    }

    setLoader(true)
    postBecomeAgent(body)
      .then(async res => {
        console.log(res.data)

        if (res.data.success) {
          let message = res.data.message || res.data.error
          let result = await translate(message, { to: i18n.language})
          if (result.length === 0) result = [res.data.message || res.data.error] 
          ShowToast.success(result[0])
          props.navigation.navigate('Success', { agent: true })
        } else {
          
          let message = res.data.message || res.data.error
          let result = await translate(message, { to: i18n.language})
          if (result.length === 0) result = [res.data.message || res.data.error] 
          ShowToast.error(result[0]);

          Sentry.Native.captureEvent({
            info: "Failed to send agent request",
            data: res.data
          }, {data: res.data})
        }
      })
      .catch(err => {
        handleError(err)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  return (
    <Layout {...props}>
      {loader && <Loader visible={loader} />}
      <ScrollViewLayout>
        <View style={styles.container}>
          <View>
            <Text style={styles.signUpText}>{t("signUp")}</Text>
          </View>
          <View style={styles.signUpForm}>
            
            <InputField
              title={t("fullName")}
              value={[name, setName]}
              errorMessage={errors.name}
            />
            <InputField
              title={t("emailAddress")}
              value={[email, setEmail]}
              errorMessage={errors.email}
            />
            
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.inputFontSize}>{t("country")}</Text>
              {errors.country && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="information-circle-outline"
                    color={farmerColor.cancelledColor}
                    size={normalize(15)}
                    style={{
                      paddingVertical: normalize(8),
                    }}
                  />
                  <Text style={styles.inputFontSizeError}>{errors.country}</Text>
                </View>
              )}  
            </View>
            
            <SelectDropdown
              data={countries}
              onSelect={(selectedItem, index) => {
                setCountry({
                  name: selectedItem[0],
                  code: selectedItem[1]
                });
                if (selectedItem[0] != country.name) {
                  setLocationList([])
                  setTimeout(() => setLocationList(locations[selectedItem[1]]), 100)
                  setLocation("")
                }
              }}
              defaultButtonText=" "
              defaultValue={country.name}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem[0]
              }}
              rowTextForSelection={selectedItem => {
                return selectedItem[0]
              }}
              dropdownStyle={{
                borderRadius: normalize(10),
                paddingHorizontal: normalize(10),
              }}
              rowStyle={{
                paddingHorizontal: normalize(10),
                width: "100%",
              }}
              rowTextStyle={{
                textAlign: "left",
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.tabBarIconColor,
              }}
              buttonStyle={{
                width: "100%",
                borderRadius: normalize(8),
                fontFamily: fonts.MontserratSemiBold,
                marginVertical: normalize(6),
                backgroundColor: !errors.country ? farmerColor.lighterGreen : farmerColor.errors,
              }}
              buttonTextStyle={{
                textAlign: "left",
                fontFamily: fonts.MontserratSemiBold,
                fontSize: normalize(16),
                padding: normalize(1),
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={farmerColor.tabBarIconColor}
                    size={normalize(18)}
                  />
                );
              }}
            />

            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.inputFontSize}>{t("location")}</Text>
                {errors.location && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="information-circle-outline"
                      color={farmerColor.cancelledColor}
                      size={normalize(15)}
                      style={{
                        paddingVertical: normalize(8),
                      }}
                    />
                    <Text style={styles.inputFontSizeError}>{errors.location}</Text>
                  </View>
                )}  
              </View>
              
              <SelectDropdown
                data={locationList}
                onSelect={(selectedItem, index) => {
                  setLocation(selectedItem);
                }}
                defaultButtonText=" "
                defaultValue={location}
                dropdownStyle={{
                  borderRadius: normalize(10),
                  paddingHorizontal: normalize(10),
                }}
                rowStyle={{
                  paddingHorizontal: normalize(10),
                  width: "100%",
                }}
                rowTextStyle={{
                  textAlign: "left",
                  fontFamily: fonts.MontserratSemiBold,
                  color: farmerColor.tabBarIconColor,
                }}
                buttonStyle={{
                  width: "100%",
                  borderRadius: normalize(8),
                  fontFamily: fonts.MontserratSemiBold,
                  marginVertical: normalize(6),
                  backgroundColor: !errors.location ? farmerColor.lighterGreen : farmerColor.errors,
                }}
                buttonTextStyle={{
                  textAlign: "left",
                  fontFamily: fonts.MontserratSemiBold,
                  fontSize: normalize(16),
                  padding: normalize(1),
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Icon
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={farmerColor.tabBarIconColor}
                      size={normalize(18)}
                    />
                  );
                }}
              />
            </View>
            
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
            <InputField
              title={t("confirmPassword")}
              value={[confirmPassword, setConfirmPassword]}
              secureTextEntry={true}
              errorMessage={errors.confirmPassword}
            />
          </View>
        </View>
      </ScrollViewLayout>
      <View style={styles.button}>
        <ButtonCustom
          title={(t("proceed"))}
          onPress={verify}
          // onPress={() => props.navigation.navigate("VerifyAccount")}
        />
      </View>
    </Layout>
  );
};

export default BecomeAgent;

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
  inputFontSizeError: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(8),
    color: farmerColor.cancelledColor,
    marginLeft: normalize(4)
  },
});
