import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import HomeLayout from "../agent/HomeLayout";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import font from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import fonts from "../../constants/fonts";
import CONSTANT from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  serviceActions,
  serviceSelectors,
} from "../../store/reducers/serviceSlice";
import { useEffect } from "react";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { getFarmRequest } from "../../requests/serviceProvider";
import { images } from "../../constants/images";
import { servicesList } from "../../constants/services";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const { ImageList } = CONSTANT;

const searchIcon = (
  <Icon
    style={{ margin: normalize(10), color: farmerColor.tabBarIconColor }}
    name="search-outline"
    size={normalize(25)}
  />
);
const notifIcon = (
  <Icon
    style={{ margin: normalize(10), color: farmerColor.tabBarIconColor }}
    name="notifications-outline"
    size={normalize(25)}
  />
);

let navigation = null;
const RequestList = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const requests = useSelector(serviceSelectors.selectRequests);

  useEffect(() => {
    getRequests();
    navigation = props.navigation;
  }, []);

  const getRequests = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    dispatch(loaderActions.setLoading(true));
    getFarmRequest()
      .then((res) => {
        if (res.data.success)
          dispatch(serviceActions.setRequests(res.data.data));
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  const getStatus = item => {
    let message = ""
    if (!item.pay_status) {
      message = t("Incomplete")
    } else

    if (item.status === "approved and measured") {
      message = t("Pending")
    } else

    if (item.status === "Service Provider Accepted") {
      message = t("Accepted")
    } else

    if (item.status === "Service in progress") {
      message = t("progress")
    } else

    if (item.status === "Service Delivered") {
      message = t("Completed")
    } else

    if (item.status === "Service Provider Declined") {
      message = t("Declined")
    }

    return message
  }

  const viewDetails = (item) => {
    if (!item.pay_status) {
      ShowToast.error(t("incompleteServiceRequest"));
      return;
    }

    if (item.status === "approved and measured") {
      props.navigation.navigate("PaymentPage", {request: item})
    }

    if (item.status === "Service Provider Accepted") {
      props.navigation.navigate("JobAcceptance", { item, startJob: false })
    }

    if (item.status === "Service in progress") {
      props.navigation.navigate("JobAcceptance", { item, startJob: true })
    }

    if (item.status === "Service Delivered") {
      props.navigation.navigate("JobAcceptance", { item, startJob: true, endJob: true })
    }

    if (item.status === "Service Provider Declined") {
      ShowToast.error(t("serviceRequestDeclined"))
      return
    }
  }

  const ItemList = (item, i) => {
    const service = servicesList[item.service_type.toLowerCase()];
    let quantity = " "+ t("Hectares")
    if (service) {
      if (service.quantity) {
        quantity = " "+ t("KG")
      }
    }

    return (
      <View
        key={i}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: farmerColor.white,
          borderRadius: normalize(10),
          padding: normalize(20),
          marginVertical: normalize(7),
        }}
      >
        <View
          style={{
            flex: 1,
            marginRight: normalize(30),
          }}
        >
          <Text
            style={{
              fontFamily: fonts.MontserratBold,
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(15),
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: normalize(8),
            }}
          >
            <Text style={{ fontFamily: fonts.MontserratMedium }}>
              {item.farm_size ? 
                (item.farm_size + quantity) : "-"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
              }}
            >
              {item.location}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // marginVertical: normalize(8),
            }}
          >
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
                maxWidth: "70%",
              }}
            >
              {t(item.service_type)}
            </Text>
            <Text style={{ fontFamily: fonts.MontserratMedium, maxWidth: "40%" }}>
              {getStatus(item)}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: farmerColor.lightGreen,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            padding: normalize(10),
            borderRadius: normalize(10),
          }}
        >
          <TouchableOpacity
            onPress={() =>
              // navigation.navigate("PaymentPage", { data: { helo: "Helo" } })
              viewDetails(item)
            }
          >
            {chevronRight}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <HomeLayout gradient={true} showAppBar={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={ImageList[0]}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={styles.iconContainer}>
            {iconMaker(notifIcon, () =>
              props.navigation.navigate("Notification")
            )}
            {/* {iconMaker(searchIcon)} */}
          </View>
        </View>
        <View
          style={{
            marginVertical: normalize(10),
          }}
        >
          <Text
            style={{
              fontFamily: fonts.MontserratBold,
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(20),
            }}
          >
            {t("serviceRequests")}
          </Text>
        </View>

        {requests.length === 0 ? (
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
              {t("agentNoRequests")}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{
              flex: 1,
              marginBottom: normalize(90),
              marginTop: normalize(10),
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {requests.map((item, i) => ItemList(item, i))}
          </ScrollView>
        )}
      </View>
    </HomeLayout>
  );
};
const chevronRight = (
  <Icon
    style={{
      color: farmerColor.white,
    }}
    name="chevron-forward"
    size={normalize(25)}
  />
);

const iconMaker = (icon, navigateTo) => {
  return (
    <TouchableOpacity
      style={styles.iconMaker}
      onPress={() => {
        navigateTo ? navigateTo() : "";
      }}
    >
      {icon}
    </TouchableOpacity>
  );
};
export default RequestList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: undefined,
    width: normalize(40),
    aspectRatio: 1,
    resizeMode: "center",
  },
  iconContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  iconMaker: {
    backgroundColor: farmerColor.white,
    borderRadius: normalize(10),
    marginLeft: normalize(15),
    padding: normalize(8),
  },
});
