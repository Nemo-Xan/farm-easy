import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { normalize } from "../../services";
import AppBar from "../../components/home/AppBar";
import { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  farmerActions,
  farmerSelectors,
} from "../../store/reducers/farmerSlice";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { getFarmHistory } from "../../requests/farmer";
import { servicesList } from "../../constants/services";
import { ServiceImage } from "../../components/ServiceImage";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const buttonType = {
  pending: "pending",
  approved: "approved",
  processing: "processing",
  cancelled: "cancelled",
};

const Services = (props) => {
  const {t} = useTranslation()
  const requests = useSelector(farmerSelectors.selectRequests);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(requests)
    getHistory();
  }, []);

  const getHistory = async () => {
    if (await OfflineCheck()) {
      ShowToast.error("Offline");
      return;
    }

    dispatch(loaderActions.setLoading(true));

    getFarmHistory()
      .then((res) => {
        if (res.data.code === 200 && res.data.success) {
          dispatch(farmerActions.setRequests(res.data.data));
        }
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  const displayRequests = () => {
    let latest = 0;

    let index = 412;
    let toDisplay = [];
    
    requests.forEach((request, i) => {
      const getTime = new Date(
        Date.parse(request.created_at.replace(/-/g, "/"))
      ).toDateString();
      if (getTime != latest) {
        latest = getTime;
        toDisplay.push(dateSegment(getTime, index));
        index = index * 2;
      }
      // if (i === 1) console.log(request)

      let service;
      try {
        service = servicesList[request.service_type.toLowerCase()]
        const { image } = service
      } catch {
        service = Object.values(servicesList).find(item => item.full == request.service_type)
      }

      // console.log(request.status)
      toDisplay.push(
        NotificationTile(
          service.image,
          service.hire,
          request.status,
          i,
          service.resize
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
        {/* {clockIcon} */}
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

  const NotificationTile = (image, title, btnType, i, resize) => {
    let btnComponent;
    if (btnType === buttonType.pending) {
      btnComponent = <Buttons type="rounded" title={t("Pending")} variant={1} />;
    } else if (btnType === buttonType.approved) {
      btnComponent = <Buttons type="rounded" title={t("Approved")} variant={3} />;
    } else if (btnType === buttonType.processing || btnType === "approved and measured") {
      btnComponent = <Buttons type="rounded" title={t("Processing")} variant={2} />;
    } else if (btnType === buttonType.cancelled) {
      btnComponent = <Buttons type="rounded" title={t("Cancelled")} variant={4} />;
    }else if (btnType === "Service Delivered") {
      btnComponent = <Buttons type="rounded" title={t("Completed")} variant={5} />;
    } else if (btnType == "Service Provider Declined") {
      btnComponent = <Buttons type="rounded" title={t("Cancelled")} variant={4} />;
    }
    return (
      <View
        key={i}
        style={{
          marginVertical: normalize(6),
          backgroundColor: farmerColor.white,
          padding: normalize(12),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: normalize(10),
          elevation: 2,
          maxWidth: "100%"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ServiceImage image={image} alternate={true} resize={resize} />
            <Text
              style={{
                marginLeft: normalize(10),
                fontFamily: fonts.MontserratBold,
                fontSize: normalize(16),
                maxWidth: normalize(160),
              }}
            >
              {t(title)}
            </Text>
        </View>
        {btnComponent}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[farmerColor.backgroundColor, farmerColor.bgBlue]}
      style={styles.root}
    >
      <View style={styles.container}>
        <AppBar {...props} showNotif={true} removeBack={true} showIcon={false} />
      </View>
      <View style={styles.banner}>
        <Text
          style={{
            position: "absolute",
            left: normalize(140),
            top: "28%",
            color: farmerColor.white,
            fontFamily: fonts.MontserratSemiBold,
            fontSize: normalize(20),
            width: "60%",
          }}
        >
          {t("serviceRequestHistory")}
        </Text>
      </View>
      <View style={styles.image}>
        <Image
          style={styles.imageBanner}
          source={require("../../assets/app/110.png")}
        />
      </View>
      <ScrollView
        style={{
          flex: 1,
          marginBottom: normalize(100),
          marginTop: normalize(10),
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          {/* For all events of a particular date  */}
          {displayRequests()}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Services;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: farmerColor.backgroundColor,
    paddingTop: normalize(20),
  },
  container: {
    // marginTop: normalize(20),
    marginHorizontal: normalize(20),
  },
  banner: {
    width: "100%",
    height: normalize(100),
    backgroundColor: farmerColor.teal,
    marginVertical: normalize(10),
  },
  image: {
    backgroundColor: farmerColor.backgroundColor,
    marginHorizontal: normalize(20),
    width: normalize(100),
    borderRadius: normalize(8),
    borderWidth: 4,
    borderColor: farmerColor.white,
    elevation: 10,
    marginTop: -normalize(60),
  },
  imageNotification: {
    height: undefined,
    width: normalize(30),
    aspectRatio: 1,
    resizeMode: "contain",
  },

  imageCont: {
    position: "relative",
    borderRadius: normalize(10),
    padding: normalize(10),
    // marginRight: 'auto',
    backgroundColor: farmerColor.servicesBackground,
  },
  firstColor: {
    position: "absolute",
    right: normalize(20),
    top: 0,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: normalize(10),
    borderBottomLeftRadius: normalize(10),
    backgroundColor: farmerColor.servicesBackground,
  },
  secondColor: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    left: normalize(25),
    borderTopRightRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    backgroundColor: farmerColor.servicesBackground2,
  },
  imageBanner: {
    height: normalize(90),
    width: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: normalize(10),
    padding: normalize(20),
  },
});
