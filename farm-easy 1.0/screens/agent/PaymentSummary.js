import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import HomeLayout from "./HomeLayout";
import fonts from "../../constants/fonts";
import { formatCurrency, normalize } from "../../services";
import { farmerColor } from "../../constants/colors";
import Buttons from "../../components/home/Buttons.components";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../store/reducers/authSlice";
import { useEffect } from "react";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { getPayment, postPay, putPayment } from "../../requests/agent";
import { loaderActions } from "../../store/reducers/loaderSlice";
import PaystackModal from "../../components/PaystackModal";
import { images } from "../../constants/images";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";
import Sentry from "../../services/useSentry";

const PaymentSummary = (props) => {
  const {t} = useTranslation()
  const { request_id, request, service, size, price } = props.route.params;
  const dispatch = useDispatch()
  const user = useSelector(authSelectors.selectUser)
  const profile = useSelector(authSelectors.selectProfile)
  const total = Number(Number(size) * Number(price)).toFixed(0)
  const sign = formatCurrency().sign
  const [paystack, setPaystack] = useState(false)

  useEffect(() => {
    console.log({request, service, user, profile})
  }, [])
  
  const walletIcon = (
    <Icon
      style={{
        color: farmerColor.tabBarIconColor,
        alignSelf: "center",
        marginBottom: normalize(10),
      }}
      name="wallet"
      size={normalize(25)}
    />
  );

  const paystackSuccess = (res) => {
    console.log(res)
    setPaystack(false)
    if (res.status == "success") {
      Sentry.Native.captureEvent({
        msg: "Payment Successful",
        data: {
          request, service, total
        }
      })
      putPayment({request_id, reference: res.transactionRef.reference })
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          props.navigation.navigate("PaymentConfirmation")
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
    } else {
      dispatch(loaderActions.setLoading(false));
      ShowToast.error(t("paymentNotSuccessful"))
      Sentry.Native.captureException({
        msg: "Payment not successful",
        data: {
          request, service, total, paystackRes: res
        }
      })
    }

  }

  const paystackError = (res) => {
    console.log("error")
    console.log(res)
    setPaystack(false)
    dispatch(loaderActions.setLoading(false));
    ShowToast.error(t("paymentCancelled"))
    Sentry.Native.captureException({
      info: "Payment was cancelled",
      data: {
        request, service, total, paystackRes: res
      }
    })
    // props.navigation.pop()
  }

  const pay = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"))
      return
    }

    dispatch(loaderActions.setLoading(true));

    setPaystack(true)
  }

  return (
    <HomeLayout
      // gradient={true}
      showIcon={false}
      showNotif={true}
      backIconAlt={true}
      {...props}
      
    >
      {paystack &&
        <PaystackModal 
          amount={total}
          // amount={formatCurrency(total).value}
          email={profile.email}
          visible={paystack} 
          setVisible={setPaystack} 
          callbacks={[paystackSuccess, paystackError]}
        />
      }
      <View style={{ marginTop: normalize(10) }}>
        <View>
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              textAlign: "center",
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(16),
              marginVertical: normalize(20),
              flexDirection: "row",
            }}
          >
            {t("makePayment")}
          </Text>
          {walletIcon}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginBottom: normalize(70),
          marginHorizontal: normalize(30),
        }}
      >
        {/* Top half Start */}
        <View
          style={{
            flex: 2,
            backgroundColor: farmerColor.white,
            borderTopStartRadius: normalize(20),
            borderTopEndRadius: normalize(20),
          }}
        >
          <View
            style={{
              backgroundColor: farmerColor.backgroundColor,
              height: 30,
              width: 30,
              borderTopRightRadius: 30,
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 2,
            }}
          />
          <View
            style={{
              backgroundColor: farmerColor.backgroundColor,
              height: 30,
              width: 30,
              borderTopLeftRadius: 30,
              position: "absolute",
              bottom: 0,
              right: 0,
              zIndex: 2,
            }}
          />
          {/* Line Horizontal */}
          <View
            style={{
              position: "absolute",
              width: "100%",
              bottom: 0,
              left: 0,
              borderBottomColor: farmerColor.blackWithAlpha,
              borderBottomWidth: 2,
              borderStyle: "dashed",
            }}
          />
          {/* Content */}
          <View
            style={{
              marginHorizontal: normalize(10),
              marginVertical: normalize(10),
            }}
          >
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                marginBottom: normalize(20),
                marginTop: normalize(5),
                color: farmerColor.tabBarIconColor,
                textAlign: "center",
                fontSize: normalize(16),
              }}
            >
              {user.name}
            </Text>
            <DetailsTile title={t("Farmer")} value={request.name} />
            <DetailsTile title={t("Service")} value={t(
              service.image === images.extension  || service.image == images.offtaker ? service.full : service.hire
            )} />
            <DetailsTile 
              title={service.quantity ? t("quantity"): t("farmSize")} 
              value={`${size} ${service.quantity ? t("KG"): t("Hectares")}`} 
            />
            <DetailsTile 
              title={service.quantity ? t("pricePerKg"): t("hectareRate")} 
              value={`${sign} ${formatCurrency(price).value.format()}`} 
            />
          </View>
        </View>
        {/* Top half ends */}

        {/* Bottom half start */}
        <View
          style={{
            flex: 0.8,
            backgroundColor: farmerColor.white,
            borderBottomStartRadius: normalize(20),
            borderBottomEndRadius: normalize(20),
          }}
        >
          <View
            style={{
              backgroundColor: farmerColor.backgroundColor,
              height: 30,
              width: 30,
              borderBottomRightRadius: 30,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <View
            style={{
              backgroundColor: farmerColor.backgroundColor,
              height: 30,
              width: 30,
              borderBottomLeftRadius: 30,
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
          <View
            style={{
              marginHorizontal: normalize(40),
              marginVertical: normalize(20),
            }}
          >
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
                color: farmerColor.tabBarIconSelectedColor,
                marginBottom: normalize(10),
              }}
            >
              {t("youAreToPay")}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: fonts.MontserratBold,
                  fontSize: normalize(22),
                  alignSelf: "center",
                  color: farmerColor.tabBarIconSelectedColor,
                  marginTop: normalize(8)
                }}
              >
                {formatCurrency(total).value.format()}.
              </Text>
              <Text
                style={{
                  fontFamily: fonts.MontserratBold,
                  fontSize: normalize(16),
                  alignSelf: "flex-end",
                  color: farmerColor.tabBarIconSelectedColor,
                  marginBottom: normalize(3)
                }}
              >
                00{" "}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.MontserratMedium,
                  fontSize: normalize(16),
                  alignSelf: "flex-end",
                  color: farmerColor.tabBarIconSelectedColor,
                  marginBottom: normalize(3)
                }}
              >
                {sign}
              </Text>
            </View>
          </View>
        </View>
        {/* Bottom half ends */}
        <View style={{ alignSelf: "center", marginTop: normalize(20) }}>
          <Buttons type="nonrounded" title={t("payNow")} extendedPadding="normal" onClick={pay}/>
        </View>
      </View>
    </HomeLayout>
  );
};

const DetailsTile = ({ title, value }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: normalize(5),
      }}
    >
      <Text
        style={{
          fontFamily: fonts.MontserratMedium,
          marginBottom: normalize(20),
          marginTop: normalize(5),
          color: farmerColor.tabBarIconSelectedColor,
          textAlign: "left",
          fontSize: normalize(14),
          flex: 1,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: fonts.MontserratSemiBold,
          marginBottom: normalize(20),
          marginTop: normalize(5),
          color: farmerColor.tabBarIconColor,
          textAlign: "left",
          fontSize: normalize(15),
          flex: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default PaymentSummary;

const styles = StyleSheet.create({});
