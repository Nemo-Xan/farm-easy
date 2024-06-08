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
import { formatCurrency, normalize } from "../../services";
import { farmerColor } from "../../constants/colors";
import Buttons from "../../components/home/Buttons.components";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../store/reducers/authSlice";
import { useEffect } from "react";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { postPay } from "../../requests/agent";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { getFarmRequest, putAcceptRequest, putRejectRequest } from "../../requests/serviceProvider";
import { serviceActions } from "../../store/reducers/serviceSlice";
import { servicesList } from "../../constants/services";
import { images } from "../../constants/images";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const PaymentSummary = (props) => {
  const {t} = useTranslation()
  const { request } = props.route.params;
  const dispatch = useDispatch()
  const user = useSelector(authSelectors.selectUser)
  const total = Number(formatCurrency(Number(request.farm_size) * Number(request.hectare_rate)).value).format(0)
  const sign = formatCurrency(1).sign

  console.log(request)

  let service = servicesList[request.service_type.toLowerCase()];
  if (!service) {
    service = Object.values(servicesList).find(item => item.full === request.service_type)
  }

  useEffect(() => {
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

  const refreshRequests = async () => {
    getFarmRequest()
      .then((res) => {
        console.log(res.data);
        if (res.data.success) 
          dispatch(serviceActions.setRequests(res.data.data))
      })
      .catch(handleError)
      .finally(() => {
        // dispatch(loaderActions.setLoading(false));
      });
  }

  const accept = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"))
      return
    }

    dispatch(loaderActions.setLoading(true));

    putAcceptRequest(request.id)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          ShowToast.success(t("requestAccepted"))
          refreshRequests()
          props.navigation.pop()
          props.navigation.navigate("JobAcceptance", { item: request, startJob: false })
        } else {
          ShowToast.error(res.data.message)
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });

  }

  const decline = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"))
      return
    }

    dispatch(loaderActions.setLoading(true));

    putRejectRequest(request.id)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          ShowToast.success(t("requestRejected"))
          refreshRequests()
          props.navigation.popToTop()
        } else {
          ShowToast.error(res.data.message)
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });

  }

  const test = () => {
    if (service.image == images.extension || service.image == images.offtaker) {
      return true
    }
    return false
  }
  return (
    <HomeLayout
      // gradient={true}
      showIcon={false}
      showNotif={true}
      backIconAlt={true}
      {...props}
    >
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
            {t(test() ? 'acceptRequest': 'receivePayment')}
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
              {t("agentRequest")}
            </Text>
            <DetailsTile title={t("Agent")} value={request.name} />
            <DetailsTile title={t("Service")} value={t(service.full)} />
            {test() ? 
            <DetailsTile title={t("location")} value={request.location} /> : 
            <>
            <DetailsTile 
              title={service.quantity ? t("quantity"): t("farmSize")} 
              value={`${request.farm_size} ${service.quantity ? t("KG"): t("Hectares")}`} 
            />
            <DetailsTile 
              title={service.quantity ? t("pricePerKg"): t("hectareRate")} 
              value={`${sign} ${Number(formatCurrency(request.hectare_rate).value).format()}`} 
            />
            </>
            }
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
            {test() ? 
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
                color: farmerColor.tabBarIconSelectedColor,
                marginBottom: normalize(10),
                fontSize: normalize(20),
                textAlign: 'center'
              }}
            >
              {t("pendingRequest")}
            </Text>:
            <>
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
                color: farmerColor.tabBarIconSelectedColor,
                marginBottom: normalize(10),
              }}
            >
              {t("youWillReceive")}
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
                {total}.
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
            </>
            }
          </View>
        </View>
        {/* Bottom half ends */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: normalize(20) }}>
          <Buttons type="nonrounded" title={t("accept")} extendedPadding="normal" onClick={accept}/>
          <Buttons type="nonrounded" title={t("decline")} extendedPadding="normal" onClick={decline} color/>
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
