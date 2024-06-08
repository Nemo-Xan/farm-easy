import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import HomeLayout from "../agent/HomeLayout";
import fonts from "../../constants/fonts";
import { normalize } from "../../services";
import { farmerColor } from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { measurementSelectors } from "../../store/reducers/measurementSlice";
import { authSelectors } from "../../store/reducers/authSlice";
import OfflineCheck from "../../services/network";
import { putFarmMeasurement } from "../../requests/agent";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { userTypes } from "../../constants/users";
import { ShowToast } from "../../services/toastConfig";
import Sentry from "../../services/useSentry";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const FarmList = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const measurements = useSelector(measurementSelectors.selectMeasurements);
  const role = useSelector(authSelectors.selectRole)
  const params = props.route.params

  const uploadFarm = async (size) => {
    try {
      const { request, service, request_id, price } = params
      
      if (await OfflineCheck()) {
        ShowToast.error(t("offline"));
        return;
      }

      dispatch(loaderActions.setLoading(true));

      putFarmMeasurement({ request_id, farm_size: size})
        .then(res => {
          console.log(res.data)
          if (res.data.success) {
            ShowToast.success(t("measurementRecorded"))
            props.navigation.navigate("PaymentSummary", { request_id, request, service, size, price })
          } else {
            ShowToast.error(res.data.message)
          }
        })
        .catch(handleError)
        .finally(() => {
          dispatch(loaderActions.setLoading(false));
        });

    } catch (e){
      if (role === userTypes.agent) {
        ShowToast.info(t("selectServiceRequestFirst"))
      }
    }
  }

  const FarmItem = (number, farmName, size) => {
    return (
      <TouchableOpacity
        key={number}
        onPress={() =>
          // props.navigation.navigate.navigate("PaymentSummary", {
          //   data: { number, farmName, size },
          // })
          uploadFarm(size)
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: farmerColor.white,
            paddingHorizontal: normalize(15),
            paddingVertical: normalize(20),
            borderRadius: normalize(10),
            marginVertical: normalize(5),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", maxWidth: '60%' }}>
            <Text
              style={{
                marginRight: normalize(20),
                fontFamily: fonts.MontserratMedium,
                color: farmerColor.tabBarIconColor,
              }}
            >
              {number}.
            </Text>
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
                color: farmerColor.tabBarIconColor,
              }}
            >
              {farmName}
            </Text>
          </View>
          <View style={{ maxWidth: "35%"}}>
            <Text
              style={{
                fontFamily: fonts.MontserratBold,
              }}
            >
              {size} ha
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <HomeLayout gradient showIcon={false} showNotif={true} backIconAlt={true} {...props}>
      <View style={{ marginTop: normalize(20), marginBottom: normalize(110) }}>
        <Text
          style={{
            fontFamily: fonts.MontserratSemiBold,
            textAlign: "center",
            color: farmerColor.tabBarIconColor,
            fontSize: normalize(16),
            marginVertical: normalize(20),
          }}
        >
          {t("allFarmMeasurements")}
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: normalize(90) }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View>
            {/* {FarmItem(1, "Joel Goni's Farm", 1.5, props.navigation)}
            {FarmItem(2, "Abdullah Farms", 1, props.navigation)} */}
            {measurements.map((item, i) =>
              FarmItem(i + 1, item.name, item.size)
            )}

            {/* {FarmItem(3, "Uchenna Farms Farm", 2, props.navigation)}
            {FarmItem(4, "Kwi Farm", 1.5, props.navigation)}
            {FarmItem(5, "Mayor Farm", 1.62, props.navigation)}
            {FarmItem(6, "Kayy Farm", 1.7, props.navigation)}
            {FarmItem(7, "chimdiya Farm", 1.4, props.navigation)}
            {FarmItem(8, "Patricia Farm", 5, props.navigation)}
            {FarmItem(9, "Babagana Farm", 25, props.navigation)} */}
          </View>
        </ScrollView>
      </View>
    </HomeLayout>
  );
};

export default FarmList;

const styles = StyleSheet.create({});
