import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import HomeLayout from "./HomeLayout";
import imagesList, { images } from "../../constants/images";
import Icon from "react-native-vector-icons/Ionicons";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { getAllFarmerRequest } from "../../requests/agent";
import { authActions, authSelectors } from "../../store/reducers/authSlice";
import { agentActions, agentSelectors } from "../../store/reducers/agentSlice";
import { servicesList } from "../../constants/services";
import { ServiceImage } from "../../components/ServiceImage";
import Sentry from "../../services/useSentry";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

let navigation = null;
let loaded = false

const LandingPage = (props) => {
  const dispatch = useDispatch();
  const {t} = useTranslation()
  const profile = useSelector(authSelectors.selectProfile);
  const requests = useSelector(agentSelectors.selectRequests);
  const user = useSelector(authSelectors.selectUser)

  const currentLocation = `${profile?.address || "-"}, ${profile?.location || "-"}`

  useEffect(() => {
    // getRequests();
    navigation = props.navigation;
  }, []);

  useFocusEffect( 
    useCallback(() => {
      getRequests()
    }, [])
  )
  

  const getRequests = async () => {
    // if (await OfflineCheck()) {
    //   ShowToast.error(t("offline"));
    //   return;
    // }

    !loaded && dispatch(loaderActions.setLoading(true))

    loaded = true
    getAllFarmerRequest()
      .then((res) => {
        // console.log(res.data.data)
        if (res.data.code == 200 && res.data.success)
          dispatch(agentActions.setRequests(res.data.data));
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  const displayRequests = () => {
    let latest = 0;

    let index = 412;
    let toDisplay = [];
    requests.forEach((request, i) => {
      if (request.pay_status) {
        if (request.agent_id != user.id) {
          return
        }
      }
      const getTime = new Date(
        Date.parse(request.created_at.replace(/-/g, "/"))
      ).toDateString();
      if (getTime != latest) {
        latest = getTime;
        toDisplay.push(dateSegment(getTime, index));
        index = index * 2;
      }
      // console.log(request.service_type)
      let service = servicesList[request.service_type.toLowerCase()];
      if (!service) {
        service = Object.values(servicesList).find(item => item.full === request.service_type)
      }

      toDisplay.push(
        CardTile(
          service?.image,
          service?.hire,
          request.name,
          request.location,
          request.phone,
          request,
          service,
          i
        )
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

  const processRequest = (request, service) => {
    if (!request.pay_status) {
      // ShowToast.error("Incomplete service request");
      props.navigation.navigate("ServiceProviderList", { request, service })
      return;
    }

    if (request.status === "approved and measured") {
      ShowToast.info(t("agentPendingAcceptance"));
      return
    }

    if (request.status === "Service Provider Accepted") {
      ShowToast.info(t("agentRequestAccepted"));
      return
    }

    if (request.status === "Service in progress") {
      ShowToast.info(t("agentRequestProgress"));
      return
    }

    if (request.status === "Service Delivered") {
      ShowToast.success(t("agentRequestCompleted"));
      return
    }

    if (request.status === "Service Provider Declined") {
      ShowToast.error(t("agentRequestDeclined"))
      return
    }
    Sentry.Native.captureException({
      info: "Unhandled Request service (agent landing page)",
      data: request
    })

    props.navigation.navigate("ServiceProviderList", { request, service })
  }

  const CardTile = (
    image,
    requestName,
    name,
    location,
    number,
    request,
    service,
    i
  ) => {
    return (
      <View style={styles.card} key={i}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginLeft: normalize(6),
          }}
        >
          <ServiceImage image={image} alternate={true} />
          <View style={{ marginLeft: normalize(10), width: normalize(190) }}>
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.tabBarIconColor,
                marginVertical: normalize(3),
                fontSize: normalize(18),
              }}
            >
              {t(requestName)}
            </Text>
            <Text
              style={{
                fontFamily: fonts.MontserratBold,
                color: farmerColor.tabBarIconColor,
                marginVertical: normalize(3),
                fontSize: normalize(18),
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontFamily: fonts.MontserratMedium,
                color: farmerColor.tabBarIconColor,
                marginVertical: normalize(3),
                fontSize: normalize(12),
                letterSpacing: 0.7,
              }}
            >
              {location}
            </Text>
            <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.tabBarIconColor,
                marginVertical: normalize(5),
                fontSize: normalize(15),
              }}
            >
              {number}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: farmerColor.lightGreen,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            padding: normalize(10),
            borderRadius: normalize(10),
          }}
          onPress={() =>
            // navigation.navigate("ServiceProviderList", { request, service })
            processRequest(request, service)
          }
        >
          {chevronRight}
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <HomeLayout gradient={true} showAppBar={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={imagesList[0]}
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

        <View style={{ marginTop: normalize(20) }}>
          <View style={styles.greenTab}>
            {globeIcon}
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.white,
                fontSize: normalize(17),
                flex: 1,
              }}
            >
              {currentLocation}
            </Text>
            {/* <Text
              style={{
                fontFamily: fonts.MontserratSemiBold,
                color: farmerColor.white,
                fontSize: normalize(17),
              }}
            >
              {" "}
              {profile?.location || "-"}
            </Text> */}
          </View>
        </View>

        {requests.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              marginBottom: normalize(90),
              marginTop: normalize(10),
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1, marginTop: normalize(0) }}>
              {displayRequests()}
            </View>
          </ScrollView>
        ) : (
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
              }}
            >
              {t("agentNoRequests")}
            </Text>
          </View>
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

const globeIcon = (
  <Icon
    style={{ margin: normalize(10), color: farmerColor.white }}
    name="earth"
    size={normalize(25)}
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

export default LandingPage;

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
  greenTab: {
    backgroundColor: farmerColor.agentLandingPageGreenTab,
    width: "100%",
    flexDirection: "row",
    borderRadius: normalize(10),
    alignItems: "center",
    paddingVertical: normalize(7),
    paddingHorizontal: normalize(10),
    // overflow: "hidden"
  },
  cardContainer: {
    marginTop: normalize(20),
  },
  card: {
    marginBottom: normalize(10),
    backgroundColor: farmerColor.white,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(16),
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: normalize(10),
  },
  imageCard: {
    height: undefined,
    width: normalize(40),
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: normalize(8),
    marginHorizontal: normalize(8),
  },
});
