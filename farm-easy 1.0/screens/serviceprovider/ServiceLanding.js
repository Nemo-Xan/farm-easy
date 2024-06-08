import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import AppBar from "../../components/home/AppBar";
import colors, { farmerColor } from "../../constants/colors";
import { formatCurrency, formatTime, normalize } from "../../services";
import Icon from "react-native-vector-icons/Ionicons";
import fonts from "../../constants/fonts";
import { useDispatch, useSelector } from "react-redux";
import { serviceActions, serviceSelectors } from "../../store/reducers/serviceSlice";
import { useEffect } from "react";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { getAgentPayments, getFarmRequest } from "../../requests/serviceProvider";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "../../constants/images";
import { servicesList } from "../../constants/services";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const checkMarkIcon = (
  <Icon
    style={{ color: farmerColor.white }}
    name="checkmark"
    size={normalize(15)}
  />
);
const clockIcon = (
  <Icon
    style={{
      marginRight: normalize(14),
      color: farmerColor.tabBarIconColor,
    }}
    name="time-outline"
    size={normalize(25)}
  />
);

let navigation = null
const ServiceLanding = (props) => {
  const {t} = useTranslation()
  const payments = useSelector(serviceSelectors.selectPayments);
  const requests = useSelector(serviceSelectors.selectRequests);
  const dispatch = useDispatch();

  useEffect(() => {
    getRequests();
    getPayments();
    navigation = props.navigation
  }, []);

  const getRequests = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    getFarmRequest()
      .then((res) => {
        if (res.data.success)
          dispatch(serviceActions.setRequests(res.data.data));
      })
      .catch(handleError)
      .finally(() => {
      });
  };

  const getPayments = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    dispatch(loaderActions.setLoading(true));

    getAgentPayments()
      .then((res) => {
        if (res.data.success) {
          dispatch(serviceActions.setPaymemts(res.data.data))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  const displayWallet = () => {
    let latest = 0;

    let index = 412;
    let toDisplay = [];

    payments.forEach((request, i) => {
      const getTime = new Date(
        Date.parse(request.created_at.replace(/-/g, "/"))
      ).toDateString();
      if (getTime != latest) {
        latest = getTime;
        toDisplay.push(dateSegment(getTime, index));
        index = index * 2;
      }

      // const time = new Date(
      //   Date.parse(request.created_at.replace(/-/g, "/"))
      // ).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit'})
      
      const time = new Date(
        Date.parse(request.created_at.replace(/-/g, "/"))
      )

      let service;
      try {
        service = servicesList[request.service_type.toLowerCase()]
        let test = service.image
      } catch {
        service = Object.values(servicesList).find(item => item.full == request.service_type)
        if (!service) service = {}
      }
      
      let amount = ""
      if (request.pay_status === "Paid" && request.status === "Service Delivered") {
        try {
          let price = formatCurrency(Number(request.farm_size) * Number(request.hectare_rate))
          amount = "+"+ Number(price.value).format(0)
        } catch {
          amount == t("pending")
        }
      } else {
        amount = t("pending")
      }

      toDisplay.push(
        Card({
          i,
          quantity: `${request.farm_size}${service.quantity ? " "+ t("KG"): " "+ t("Hectares")}`,
          amount,
          time: formatTime(time)
        })
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

  const Card = (item) => {
    return (
      <View
        key={item.i}
        style={{
          backgroundColor: farmerColor.white,
          marginVertical: normalize(7),
          borderRadius: normalize(8),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: farmerColor.tabBarIconSelectedColor,
              height: normalize(30),
              width: normalize(30),
              borderRadius: normalize(15),
              margin: normalize(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {checkMarkIcon}
          </View>
          <View>
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.tabBarIconColor,
                marginTop: normalize(8),
                marginBottom: normalize(10),
                marginHorizontal: normalize(10),
              }}
            >
              {t("payment")} [{item.quantity}]
            </Text>
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                marginTop: normalize(2),
                marginBottom: normalize(10),
                marginHorizontal: normalize(10),
                fontSize: normalize(12),
                color: farmerColor.lightGreen,
              }}
            >
              {item.time}
            </Text>
          </View>
        </View>
        <View style={{ marginRight: normalize(8) }}>
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              color: farmerColor.approvedColor,
            }}
          >
            {item.amount}
          </Text>
        </View>
      </View>
    );
  };
  
  const CustomButtons = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RequestStack')
        }}
        style={{
          backgroundColor: farmerColor.white,
          alignSelf: "flex-start",
          marginVertical: normalize(10),
          paddingVertical: normalize(10),
          paddingHorizontal: normalize(15),
          borderRadius: normalize(8),
        }}
      >
        <View style={styles.viewContainer}>
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              color: farmerColor.tabBarIconColor,
            }}
          >
            {t("viewAll")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[farmerColor.backgroundColor, farmerColor.bgBlue]}
      style={styles.root}
    >
      <View style={styles.container}>
        <AppBar {...props} showIcon={false} showNotif={true} removeBack={true} />
        <View style={styles.banner}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.white,
              }}
            >
              { requests.length > 0 ?
              // `You Have ${requests.length} Request${requests.length > 1 ? "s" : ""}` :
              (t("youHaveXRequests_pre") + requests.length + t("youHaveXRequests_post")) :
              t("youHaveNoRequests")}
            </Text>
          </View>
          <CustomButtons {...props} />
        </View>
        {payments.length === 0 ?
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: normalize(80),
            }}
          >
            <Image
              source={images.pleadingFace}
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
              {t("youHaveNoPaymentHistory")}
            </Text>
          </View> :
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, marginBottom: normalize(95) }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ marginTop: normalize(10) }}>
              {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: farmerColor.tabBarIconColor,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.MontserratBold,
                    color: farmerColor.tabBarIconColor,
                    fontSize: normalize(14),
                  }}
                >
                  Monday,
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.MontserratSemiBold,
                    color: farmerColor.tabBarIconColor,
                    fontSize: normalize(14),
                  }}
                >
                  {" "}
                  22 Sep. 2022
                </Text>
              </View> */}
              {/* <Card /> */}
              {displayWallet()}
            </View>
          </ScrollView>
        }
      </View>
    </LinearGradient>
  );
};

export default ServiceLanding;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: farmerColor.backgroundColor,
  },
  container: {
    marginTop: normalize(20),
    marginHorizontal: normalize(20),
    flex: 1,
  },
  banner: {
    backgroundColor: farmerColor.lightGreen,
    marginVertical: normalize(10),
    borderRadius: normalize(10),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
