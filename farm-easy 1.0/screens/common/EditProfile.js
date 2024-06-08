import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import React, { useCallback, useState } from "react";
import HomeLayout from "../farmer/HomeLayout";
import Buttons from "../../components/home/Buttons.components";
import InputField from "../../components/InputField";
import SelectDropdown from "react-native-select-dropdown";
import fonts from "../../constants/fonts";
import { farmerColor } from "../../constants/colors";
import { isEmail, normalize } from "../../services";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../store/reducers/authSlice";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { ShowToast } from "../../services/toastConfig";
import { getProfile, putProfile } from "../../requests/auth";
import { getServiceTypes } from "../../requests/serviceProvider";
import { useEffect } from "react";
import locations from "../../constants/locations";
import { getFarmHistory } from "../../requests/farmer";
import { userTypes } from "../../constants/users";
import OfflineCheck from "../../services/network";
import { getAllFarmerRequest } from "../../requests/agent";
import { agentActions } from "../../store/reducers/agentSlice";
import { useFocusEffect } from "@react-navigation/native";
import MultipleSelect, { MultipleSelectTrigger } from "../../components/MultipleSelect";
import { servicesList } from "../../constants/services";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";
import banks from "../../constants/banks";

const initErrors = {
  email: "",
  farmName: "",
  location: "",
  address: "",
  bank: "",
  accountName: "",
  accountNumber: "",
  multiselect: "",
};

const farmTypes = [
  "Rice", "Wheat", "Maize", "Others"
]

const EditProfile = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const profile = useSelector(authSelectors.selectProfile);
  const role = useSelector(authSelectors.selectRole);
  const user = useSelector(authSelectors.selectUser);

  const [email, setEmail] = useState(profile?.email);
  const [farmName, setFarmName] = useState(profile?.business_name);
  const [location, setLocation] = useState(profile?.location);
  const [address, setAddress] = useState(profile?.address);
  const [bank, setBank] = useState(profile?.bank_name);
  const [accountName, setAccountName] = useState(profile?.account_name);
  const [accountNumber, setAccountNumber] = useState(profile?.account_number);
  const [errors, setErrors] = useState(JSON.parse(JSON.stringify(initErrors)));
  const [selectMulti, setSelectMulti] = useState(false)

  const [selected, setSelected] = useState(
    role === userTypes.agent ?
      [] : 
    role === userTypes.farmer ?
    (profile.farm_type || []) : (profile.service_type || [])
  )

  const locationList = [...locations[user.country]];
  const bankList = banks[user.country]

  useFocusEffect(
    useCallback(() => {
      try {
        const { showErrors } = props.route.params
        if (showErrors) {
          saveProfile()
        }
      } catch {

      }
    }, [])
  );

  useEffect(() => {
    if (role === userTypes.agent) {
    }
  }, []);

  const refreshData = () => {
    getAllFarmerRequest()
      .then((res) => {
        if (res.data.code == 200 && res.data.success)
          dispatch(agentActions.setRequests(res.data.data));
      })
      .catch(handleError);
  };

  const saveProfile = async () => {
    setErrors(JSON.parse(JSON.stringify(initErrors)));
    let tempErrors = JSON.parse(JSON.stringify(initErrors));
    let errorFound = false;

    if (!location) {
      tempErrors.location = t("required");
      errorFound = true;
    }
    if (!address) {
      tempErrors.address = t("required");
      errorFound = true;
    }

    if (role === userTypes.agent && !email) {
      tempErrors.email = t("required");
      errorFound = true;
    }

    const body = {
      location,
      address,
    };

    if (email) {
      if (!isEmail(email)) {
        tempErrors.email = t("invalidFormat");
        errorFound = true;
      } else {
        body.email = email;
      }
    }

    if (role == userTypes.agent && !email) {
      tempErrors.email = t("required");
      errorFound = true;
    }

    if (role === userTypes.farmer) {
      if (!farmName) {
        tempErrors.farmName = t("required");
        errorFound = true;
      } else {
        body.business_name = farmName;
      }
    } else {
      if (bank) {
        body.bank_name = bank;
      }
      if (accountName) {
        body.account_name = accountName;
      }
      if (accountNumber) {
        body.account_number = accountNumber;
      }
    }

    if (role == userTypes.serviceProvider && selected.length == 0) {
      tempErrors.multiselect = t("required");
      errorFound = true;
    }
    
    if (role == userTypes.farmer && selected.length == 0) {
      tempErrors.multiselect = t("required");
      errorFound = true;
    }

    if (errorFound) {
      try {
        const { showErrors } = props.route.params
        if (showErrors) {
          ShowToast.error(t("completeProfileSetup"));
          setErrors(tempErrors);
          return;
        }
      } catch {
        
      }
      ShowToast.error(t("validInfo"));
      setErrors(tempErrors);
      return;
    }

    if (await OfflineCheck()) {
      ShowToast.error(t("networkError"));
      return;
    }
    dispatch(loaderActions.setLoading(true));

    if (role == userTypes.serviceProvider) {
      body.service_type = selected
    }

    if (role == userTypes.farmer) {
      body.farm_type = selected
    }

    putProfile(body)
      .then(async (res) => {
        console.log(res.data);
        if (!res.data.success) {
          ShowToast.error(res.data.error);
        } else {
          ShowToast.success(t("updateSuccessful"));
          refreshData();
          getProfile().then((res) => {
            if (res.data?.code === 200 && res.data?.success) {
              dispatch(authActions.setProfile(res.data.data));
            }
          });

          props.navigation.pop();
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  return (
    <HomeLayout gradient={true} {...props} backIconAlt={true} settings={true}>
      {selectMulti && (role != userTypes.agent) && 
        <MultipleSelect 
          visible={selectMulti} 
          setVisible={setSelectMulti}
          selected={selected}
          setSelected={setSelected}
          data={role === userTypes.serviceProvider ? Object.values(servicesList): farmTypes}
        />
      }
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: normalize(50) }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {role === userTypes.farmer && (
                <>
                  <InputField
                    colorAlt={true}
                    title={t("farmName")}
                    value={[farmName, setFarmName]}
                    errorMessage={errors.farmName}
                  />
                  <MarginComp />
                </>
              )}

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
                {/* <Text style={styles.inputFontSize}>{t("location")}</Text> */}
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
                    fontFamily: fonts.MontserratSemiBold,
                    marginVertical: normalize(10),
                    backgroundColor: !errors.location ? farmerColor.white : farmerColor.errors,
                    borderRadius: normalize(8),
                  }}
                  buttonTextStyle={{
                    textAlign: "left",
                    fontFamily: fonts.MontserratSemiBold,
                    fontSize: normalize(14),
                    padding: normalize(0),
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
                <MarginComp value={10} />
              </View>

              <InputField
                colorAlt={true}
                title={t("address")}
                value={[address, setAddress]}
                errorMessage={errors.address}
              />
              <MarginComp />

              <InputField
                colorAlt={true}
                title={t("email")}
                value={[email, setEmail]}
                errorMessage={errors.email}
              />
              <MarginComp />

              {role == userTypes.farmer &&
                <MultipleSelectTrigger 
                  title={role === userTypes.serviceProvider ? "Service": "Crop Type"} 
                  colorAlt 
                  setVisible={setSelectMulti}
                  selected={selected}
                  errorMessage={errors.multiselect}
                />
              }
              <MarginComp />

              {role != userTypes.farmer && (
                <>
                  <View>
                    <Text style={styles.inputFontSize}>{t("bank")}</Text>
                    <SelectDropdown
                      data={bankList}
                      onSelect={(selectedItem, index) => {
                        setBank(selectedItem);
                      }}
                      defaultButtonText=" "
                      defaultValue={bank}
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
                        fontFamily: fonts.MontserratSemiBold,
                        marginVertical: normalize(10),
                        backgroundColor: farmerColor.white,
                        borderRadius: normalize(8),
                      }}
                      buttonTextStyle={{
                        textAlign: "left",
                        fontFamily: fonts.MontserratSemiBold,
                        fontSize: normalize(14),
                        padding: normalize(0),
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
                    {/* <MarginComp value={10} /> */}
                  </View>
                  {/* <InputField
                    colorAlt={true}
                    title={t("bank")}
                    value={[bank, setBank]}
                    errorMessage={errors.bank}
                  /> */}
                  <MarginComp />
                  <InputField
                    colorAlt={true}
                    title={t("accountName")}
                    value={[accountName, setAccountName]}
                    errorMessage={errors.account}
                  />
                  <MarginComp />
                  <InputField
                    colorAlt={true}
                    title={t("accountNumber")}
                    value={[accountNumber, setAccountNumber]}
                    errorMessage={errors.accountName}
                  />
                  <MarginComp />
                </>
              )}

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={{ marginVertical: normalize(15) }}>
        <Buttons
          onClick={saveProfile}
          type="nonrounded"
          title={t("update")}
          extendedPadding="normal"
        />
      </View>
    </HomeLayout>
  );
};

const MarginComp = ({ value }) => {
  return (
    <View
      style={{
        marginTop: normalize(value || 10),
      }}
    />
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  inputFontSize: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    marginTop: normalize(8),
    color: farmerColor.tabBarIconSelectedColor,
  },

  marginBottom: {
    marginTop: normalize(20),
  },
  
  inputFontSizeError: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(8),
    color: farmerColor.cancelledColor,
    marginLeft: normalize(4)
  },
});
