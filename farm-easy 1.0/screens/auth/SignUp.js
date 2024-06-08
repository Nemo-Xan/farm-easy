import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { normalize } from "../../services";
import InputField from "../../components/InputField";
import ButtonCustom from "../../components/ButtonCustom";
import DropDownCountry from "../../components/DropDown";
import {
  getServiceTypes,
  postSignupServiceProvider,
} from "../../requests/serviceProvider";
import { getFarmTypes, postSignupFarmer } from "../../requests/farmer";
import { registerActions } from "../../store/reducers/registerSlice";
import { useSelector, useDispatch } from "react-redux";
import { ShowToast } from "../../services/toastConfig";
import { getCountries } from "../../requests/auth";
import { userRoles } from "../../constants/users";
import Sentry from "../../services/useSentry";
import Loader from "../../components/Loader";
import translate from "translate-google-api";
import Icon from "react-native-vector-icons/Ionicons";

import Constant from "../../constants";
import OfflineCheck from "../../services/network";
import MultipleSelect, { MultipleSelectTrigger } from "../../components/MultipleSelect";
import { useTranslation } from "react-i18next";
import SelectDropdown from "react-native-select-dropdown";
import fonts from "../../constants/fonts";
import colors, { farmerColor } from "../../constants/colors";
import locations from "../../constants/locations";

const { Color, Font } = Constant;

const initErrors = {
  phone: "",
  password: "",
  confirmPassword: "",
  name: "",
  location: "",
  countryCode: "",
  cropType: "",
  serviceType: "",
  multiselect: ""
}

const SignUp = (props) => {
  const { role } = props.route.params;
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation()

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [cropType, setCropType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [farmTypes, setFarmTypes] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)))
  const [selectMulti, setSelectMulti] = useState(false)
  const [selected, setSelected] = useState([])
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        let res = await getFarmTypes();
        if (res.data) setFarmTypes(res.data.data.map(item => item.farm));

        res = await getServiceTypes();
        if (res.data) setServiceTypes(res.data.data.map(item => item.service));

        res = await getCountries();
        if (res.data) setCountries(res.data.data);

        setLoader(false);
      } catch (e) {
        console.warn(e);
        setLoader(false);
        ShowToast.error(t("networkError"))
      }
    };

    fetchData();
  }, []);

  useEffect(() => {

  }, [countryCode])

  const authenticate = async () => {
    setErrors(JSON.parse(JSON.stringify(initErrors)))
    let tempErrors = JSON.parse(JSON.stringify(initErrors))
    let errorFound = false

    if (!phone) {
      tempErrors.phone = t("Required")
      errorFound = true
    }
    
    if (!countryCode) {
      tempErrors.countryCode = t("Required")
      errorFound = true
    }

    if (!location) {
      tempErrors.location = t("required")
      errorFound = true
    }
    
    if (!name) {
      tempErrors.name = t("Required")
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
    
    if (role == userRoles.farmer && selected.length === 0) {
      tempErrors.multiselect = t("Required")
      errorFound = true
    }

    if (role == userRoles.serviceProvider && selected.length === 0) {
      tempErrors.multiselect = t("Required")
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

    if (errorFound) {
      ShowToast.error(t("validInfo"));
      setErrors(tempErrors)
      return;
    }

    if (role == userRoles.farmer) {
      const data = {
        name,
        phone,
        password,
        password_confirmation: confirmPassword,
        country_code: countryCode.country_code,
        country: countryCode.country,
        farm_type: selected,
        location,
      };

      if (await OfflineCheck()) {
        ShowToast.error(t("networkError"))
        return
      }
      
      console.log(data)
      setLoader(true);
      postSignupFarmer(data)
        .then(async (res) => {
          console.log(res.data);
          if (res.data.success) {
            ShowToast.success(t("registrationSuccessfulPleaseLogin"));
            props.navigation.navigate("Success");
          } else {
            let message = res.data.message || res.data.error
            let result = await translate(message, { to: i18n.language})
            if (result.length === 0) result = [res.data.message || res.data.error] 
            ShowToast.error(result[0]);
          }
        })
        .catch((e) => {
          console.log(e);
          ShowToast.error(t("networkError"))
        })
        .finally(() => {
          setLoader(false);
        });
    }

    if (role == userRoles.serviceProvider) {
      const data = {
        name,
        phone,
        password,
        password_confirmation: confirmPassword,
        country_code: countryCode.country_code,
        country: countryCode.country,
        service_type: selected,
        location,
      };
      setLoader(true);
      postSignupServiceProvider(data)
        .then(async (res) => {
          console.log(res.data);
          if (res.data.success) {
            ShowToast.success(t("registrationSuccessfulContactedShortly"));
            props.navigation.navigate("Success", { agent: true });
          } else {            
            let message = res.data.message || res.data.error
            let result = await translate(message, { to: i18n.language})
            if (result.length === 0) result = [res.data.message || res.data.error] 
            ShowToast.error(result[0]);
          }
        })
        .catch((e) => {
          console.log(e);
          ShowToast.error(t("networkError"))
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  const dropDownTile = () => {
    return role != userRoles.agent ? (
      <MultipleSelectTrigger
        title={role === userRoles.serviceProvider ? "Service": "Crop Type"} 
        // colorAlt 
        setVisible={setSelectMulti}
        selected={selected}
        errorMessage={errors.multiselect}
      />
    ): null
  };

  return (
    <Layout {...props}>
      {loader && <Loader visible={loader} />}
      <MultipleSelect
        visible={selectMulti} 
        setVisible={setSelectMulti}
        selected={selected}
        setSelected={setSelected}
        data={role === userRoles.serviceProvider ? 
          serviceTypes.filter(item => item != "Harvester")
          : farmTypes}
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={(event) => event.target == event.currentTarget && Keyboard.dismiss(event)}>
            <>
              <View>
                <Text style={styles.signUpText}>{t("signUp")}</Text>
              </View>
              <View style={styles.signUpForm}>
                <InputField 
                  title={t("name")} 
                  value={[name, setName]} 
                  errorMessage={errors.name}
                />
                <DropDownCountry
                  setCountry={(code) => {
                    setCountryCode(code);
                    if (countryCode.country != code.country) {
                      setLocationList([])
                      setTimeout(() => setLocationList(locations[code.country]), 100)
                      setLocation("")
                    }
                    setCountryCode(code)
                  }}
                  searchable="false"
                  data={countries}
                  title={t("countryCode")}
                  type="countries"
                  errorMessage={errors.countryCode}
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
                {dropDownTile()}
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
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
        
        <View style={styles.button}>
          <ButtonCustom
            title={t("proceed")}
            onPress={authenticate}
            // onPress={() => props.navigation.navigate("VerifyAccount")}
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default SignUp;

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
  inputFontSizeError: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(8),
    color: farmerColor.cancelledColor,
    marginLeft: normalize(4)
  },
  inputFontSize: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    marginVertical: normalize(8),
    color: colors.menuBar,
  },
  signUpForm: {
    flex: 1,
    marginTop: normalize(30),
  },
  button: {
    width: "60%",
  },
});
