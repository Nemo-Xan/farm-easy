import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import HomeLayout from "../agent/HomeLayout";
import { formatCurrency, normalize } from "../../services";
import fonts from "../../constants/fonts";
import colors, { farmerColor } from "../../constants/colors";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../store/reducers/authSlice";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useCallback } from "react";
import { ShowToast } from "../../services/toastConfig";
import OfflineCheck from "../../services/network";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { userTypes } from "../../constants/users";
import { getAgentTransaction } from "../../requests/agent";
import { getAgentPayments } from "../../requests/serviceProvider";
import { images } from "../../constants/images";
import { notificationActions, notificationSelectors } from "../../store/reducers/notificationSlice";
import { servicesList } from "../../constants/services";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

let loaded = false
const Wallet = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const role = useSelector(authSelectors.selectRole);
  const wallet = useSelector(notificationSelectors.selectWallet)

  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
    }, [])
  );

  const refreshTransactions = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    !loaded && dispatch(loaderActions.setLoading(true))

    loaded = true
    let endpoint;

    if (role == userTypes.agent) endpoint = getAgentTransaction;
    if (role == userTypes.serviceProvider) endpoint = getAgentPayments;

    endpoint()
      .then((res) => {
        if (res.data.success) {
          dispatch(notificationActions.setWallet(res.data.data))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  const walletIcon = (
    <Icon
      style={{ color: farmerColor.tabBarIconColor }}
      name="wallet-outline"
      size={normalize(18)}
    />
  );

  const displayWallet = () => {
    let latest = 0;

    let index = 412;
    let toDisplay = [];

    wallet.forEach((request, i) => {
      let service;
      try {
        service = servicesList[request.service_type.toLowerCase()]
        if (!service) {
          service = Object.values(servicesList).find(item => item.full == request.service_type)
        }
      } catch {
        service = Object.values(servicesList).find(item => item.full == request.service_type)
      }

      if (!service) {
        
        return
      }

      let amount = ""
      if (request.pay_status === "Paid" && request.status === "Service Delivered") {
        try {
          amount = formatCurrency(Number(request.farm_size) * Number(request.hectare_rate)).value.format(0) +" "+ formatCurrency().sign
        } catch {
          amount == t("Pending")
        }
      } else {
        if (role === userTypes.agent) {
          amount = request.pay_status === "Paid" ? 
            formatCurrency(Number(request.amount) / 100).value.format(0) +" "+ formatCurrency().sign 
            : t("Pending")
        } else
          amount = t("Pending")
      }

      let hectares = `${request.farm_size}${service.quantity ? " "+ t("KG"): " "+ t("Hectares")}`
      if (service.image == images.extension || service.image == images.offtaker) {
        hectares = ""
      }

      toDisplay.push(
        <WalletTile
          key={i}
          name={request.name}
          service={t(request.service_type)}
          hectares={hectares}
          amount={amount}
        />
      );
    });

    return toDisplay;
  };

  const dateSegment = (text, index) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: farmerColor.tabBarIconSelectedColor,
          marginTop: normalize(30),
          marginBottom: normalize(20),
        }}
      >
        {clockIcon}
        <Text
          style={{
            fontFamily: fonts.MontserratBold,
            color: farmerColor.tabBarIconSelectedColor,
            fontSize: normalize(14),
          }}
        >
          {text}
        </Text>
      </View>
    );
  };


  return (
    <HomeLayout
      gradient={true}
      // search={true}
      {...props}
      backIconAlt={true}
      settings={true}
    >
      <View
        style={{
          flex: 1,
          marginVertical: normalize(20),
        }}
      >
        <Text
          style={{
            fontFamily: fonts.MontserratSemiBold,
            color: farmerColor.tabBarIconColor,
            textAlign: "center",
          }}
        >
          {t("yourTransactions")}
        </Text>

        {wallet.length == 0 ?
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: normalize(80),
            }}
          >
            <Image
              source={images.exhaleFace}
              style={{ width: normalize(30), height: normalize(30) }}
            />
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                fontSize: normalize(17),
                color: colors.green,
                marginTop: normalize(16),
                textAlign: "center"
              }}
            >
              {t("noTransactions")}
            </Text>
          </View> :
          <ScrollView
            style={{ marginBottom: normalize(90), marginTop: normalize(20) }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {displayWallet()}
          </ScrollView>
        }
      </View>
    </HomeLayout>
  );
};

export default Wallet;

const WalletTile = ({ name, service, hectares, amount }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(10),
        backgroundColor: farmerColor.white,
        marginVertical: normalize(7),
        borderRadius: normalize(14),
      }}
    >
      <View style={{width: "60%",}}>
        <Text
          style={{
            fontFamily: fonts.MontserratBold,
            fontSize: normalize(16),
            color: farmerColor.tabBarIconColor,
            margin: normalize(5),
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontFamily: fonts.MontserratSemiBold,
            fontSize: normalize(16),
            margin: normalize(5),
          }}
        >
          {service}
        </Text>
      </View>
      <View style={{width: "40%",}}>
        <Text
          style={{
            fontFamily: fonts.MontserratSemiBold,
            fontSize: normalize(12),
            color: farmerColor.tabBarIconSelectedColor,
            margin: normalize(5),
            textAlign: "right",
          }}
        >
          {hectares}
        </Text>
        <Text
          style={{
            fontFamily: fonts.MontserratBold,
            fontSize: normalize(18),
            color: farmerColor.tabBarIconSelectedColor,
            margin: normalize(5),
            textAlign: 'right',
          }}
        >
          {amount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
