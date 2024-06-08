import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CONSTANT from "../../constants";
import HomeLayout from "./HomeLayout";
import { formatCurrency, normalize } from "../../services";
import { farmerColor } from "../../constants/colors";
import font from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import fonts from "../../constants/fonts";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  getAllFarmerRequest,
  getAvailableServiceProvider,
  putApproveRequest,
  putFarmMeasurement,
  putRequestServiceProvider,
} from "../../requests/agent";
import { useDispatch, useSelector } from "react-redux";
import { agentActions, agentSelectors } from "../../store/reducers/agentSlice";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { authActions } from "../../store/reducers/authSlice";
import { ServiceImage } from "../../components/ServiceImage";
import {
  serviceActions,
  serviceSelectors,
} from "../../store/reducers/serviceSlice";
import { getPrices } from "../../requests/auth";
import InputQuantity from "../../components/InputQuantity";
import { images } from "../../constants/images";
import Sentry from "../../services/useSentry";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";
import translate from "translate-google-api";

const { ImageList } = CONSTANT;

const ServiceProviderList = (props) => {
  const {t, i18n} = useTranslation()
  const { request, service } = props.route.params;
  const dispatch = useDispatch();
  const requestProviders = useSelector(agentSelectors.selectRequestProviders);
  const prices = useSelector(serviceSelectors.selectPrices);
  const [price, setPrice] = useState("")
  const sign = formatCurrency().sign
  const [visible, setVisible] = useState()

  useFocusEffect(
    useCallback(() => {
      getProviders();
    }, [])
  );

  const refreshData = () => {
    getAllFarmerRequest()
      .then((res) => {
        if (res.data.code == 200 && res.data.success)
          dispatch(agentActions.setRequests(res.data.data));
      })
      .catch((err) => {
        console.log("profile refresh error");
        console.log(err.response);
      });
  };

  const getProviders = async () => {
    let loaders = 0
    if (request && service) {
      if (await OfflineCheck()) {
        ShowToast.error(t("offline"));
        return;
      }

      dispatch(loaderActions.setLoading(true));
      // getPrices()
      //   .then((res) => {
      //     if (res.data.code == 200 && res.data.success) {
      //       dispatch(serviceActions.setPrices(res.data.data));
      //     }
      //   })
      //   .catch(handleError)
      //   .finally(() => {
      //     loaders++
      //     loaders >= 2 && dispatch(loaderActions.setLoading(false));
      //   });

      getAvailableServiceProvider(service.url || service.name)
        .then((res) => {
          if (res.data.code == 200 && res.data.success) {
            console.log(res.data)
            const data = []
            res.data.data.forEach(element => {
              if (element.hectare_rate && element.status === "verified") {
                data.push(element)
              }
            });
            dispatch(
              agentActions.setRequestProviders({
                type: service.name,
                url: service.url || null,
                value: data,
              })
            );
          }
        })
        .catch(handleError)
        .finally(() => {
          dispatch(loaderActions.setLoading(false));
        });
    }
  };

  const callback = async (quantity) => {
    setVisible(false)
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    dispatch(loaderActions.setLoading(true));

    putFarmMeasurement({ request_id: request.id, farm_size: quantity})
      .then(async res => {
        console.log(res.data)
        if (res.data.success) {
          refreshData()
          ShowToast.success(t("quantityUpdated"))
          props.navigation.navigate("PaymentSummary", { 
            request_id: request.id, request, service, size: quantity, price 
          })
        } else {
          let message = res.data.message || res.data.error
          let result = await translate(message, { to: i18n.language})
          if (result.length === 0) result = [res.data.message || res.data.error] 
          ShowToast.error(result[0]);
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  }

  const updatePayment = (item) => {
    dispatch(loaderActions.setLoading(true));

    putApproveRequest({ request_id: request.id })
      .then((res) => {
        console.log(res.data)
        if (res.data.code == 200 && res.data.success) {
          refreshData()
          ShowToast.success(t("requestSent"))
          props.navigation.popToTop()
        } else {
          Sentry.Native.captureException({
            info: "Error updating Payment for Offtaker/Extension Service",
            data: res.data,
            request: request
          })
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });

  }

  const updateRequest = async (item) => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    dispatch(loaderActions.setLoading(true));

    let price = "";
    price = item.hectare_rate

    // try {
    //   prices.forEach((item) => {
    //     if (item.service_type.toLowerCase() == service.name.toLowerCase()) price = item.price;
    //     if (item.service_type === service.full) price = item.price
    //   });
    // } catch (e) {
      
    // }
    

    setPrice(price)
    const body = {
      request_id: request.id,
      price,
      sp_id: item.id,
    };
    putRequestServiceProvider(body)
      .then((res) => {
        console.log(res.data)
        if (res.data.code == 200 && res.data.success) {
          if (service.image == images.extension || service.image == images.offtaker) {
            updatePayment(item)
            return
          }

          refreshData()
          if (service.quantity) {
            setVisible(true)
            return
          }

          ShowToast.success(t("requestUpdateProvideMeasurement"));
          props.navigation.navigate("MapStack", { 
            screen: "LandMeasurement", 
            params: { 
              request_id: body.request_id, 
              request, 
              service, 
              price 
            }
          })
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  const ItemList = (item, i) => {
    let price = "";
    let extension = false

    price = item.hectare_rate

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
        <View>
          <Text
            style={{
              fontFamily: fonts.MontserratBold,
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(15),
              marginVertical: normalize(5),
            }}
          >
            {item.name + (item.state ? ` (${item.state})`: "")}
          </Text>
          {
            service.image == images.extension || service.image == images.offtaker ?
              null:
              <Text style={{ fontFamily: fonts.MontserratMedium }}>
                {sign} {formatCurrency(price).value.format()} /{service.quantity ? t("KG") : t("Hectare")}
              </Text>
          }
        </View>
        <TouchableOpacity
          onPress={() => updateRequest(item)}
          style={{
            backgroundColor: farmerColor.lightGreen,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            padding: normalize(10),
            borderRadius: normalize(10),
          }}
        >
          {chevronRight}
        </TouchableOpacity>
      </View>
    );
  };

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
  return (
    <HomeLayout gradient={true} showAppBar={false}>
      {visible && <InputQuantity visible={visible} setVisible={setVisible} callback={callback} />}
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
        <View style={styles.banner}>
          {/* <Image source={require("../../assets/app/FME-Img3.png")} /> */}

          <ServiceImage image={service.image} marginRight={true} />
          <Text
            style={{
              fontFamily: fonts.MontserratBold,
              fontSize: normalize(20),
              padding: normalize(15),
              color: farmerColor.tabBarIconColor,
              width: "80%",
            }}
          >
            {service.image === images.extension ? t("extensionServiceProviders") :
              service.image === images.offtaker ? t("offtakers") :
              t("serviceProviders_pre") + t(service.full) + t("serviceProviders_post")
            }
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1, marginBottom: normalize(20) }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {requestProviders[service.name]?.map((item, i) => ItemList(item, i))}
        </ScrollView>
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
        navigateTo();
      }}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default ServiceProviderList;

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
  banner: {
    marginVertical: normalize(15),
    backgroundColor: farmerColor.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: normalize(10),
    flexDirection: "row",
    padding: normalize(20),
    alignItems: "center",
  },
});
