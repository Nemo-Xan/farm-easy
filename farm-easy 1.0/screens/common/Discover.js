import React from "react";
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
import HomeLayout from "../farmer/HomeLayout";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import font from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import {
  loaderActions,
  loaderSelectors,
} from "../../store/reducers/loaderSlice";
import { getFarmHistory, getVendorCount, postRequestService } from "../../requests/farmer";
import { servicesList } from "../../constants/services";
import { servicesType } from "../../constants/services";
import { authActions } from "../../store/reducers/authSlice";
import { ServiceImage } from "../../components/ServiceImage";
import { LinearGradient } from "expo-linear-gradient";
import { getIosApplicationReleaseTypeAsync } from "expo-application";
import { farmerActions, farmerSelectors } from "../../store/reducers/farmerSlice";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const { ImageList } = CONSTANT;

const Discover = (props) => {
  const {t} = useTranslation()
  const counts = useSelector(farmerSelectors.selectCounts)
  const dispatch = useDispatch()

  useEffect(() => {
    getCounts()
  }, []);

  const getCounts = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    dispatch(loaderActions.setLoading(true));
    
    getVendorCount()
      .then(res => {
        // console.log(res.data)
        if (res.data.success) {
          dispatch(farmerActions.setCounts(res.data.data))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  } 

  const ServiceTile = (data, resize) => {
    const { name, hire, image, full } = data;
    let count = ""
    if (counts.boom) {
      count = counts[data.url || name]
      if (!count)
        // count = counts[name.charAt(0).toUpperCase() + name.slice(1)]

      console.log(count)
      count = count.vendors + ""
    } else {
      count = "0"
    }

    return (
      <View style={{ width: "50%", marginVertical: normalize(10) }} key={name}>
        <TouchableOpacity
          style={{ marginRight: "auto", paddingRight: normalize(25) }}
          onPress={() => props.navigation.navigate("RequestService", { data })}
        >
          <ServiceImage image={image} resize={data.resize} />
          <Text style={styles.cardTileTextHeader}>{t(hire)}</Text>
          <Text style={styles.cardTileTextSub}>{count} {t("vendorsAvailable")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <HomeLayout gradient={true} showAppBar={false}>
      <View style={styles.container}>
        {/* Header starts */}
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
        {/* Header End */}
        {/* Banner Starts */}
        <View style={styles.banner}>
          <Text style={styles.bannerTextHeader}>{t("discover")}</Text>
          <View>
            <Image
              style={{
                width: "100%",
                borderRadius: normalize(10),
              }}
              source={ImageList[6]}
              resizeMode="stretch"
            />
            <View
              style={{
                position: "absolute",
                backgroundColor: farmerColor.blackWithAlphaExtra,
                width: "100%",
                height: "100%",
                borderRadius: normalize(10),
              }}
            />
            <View
              style={{
                position: "absolute",
                borderRadius: normalize(10),
              }}
            >
              <View
                style={{
                  marginHorizontal: normalize(20),
                  marginTop: normalize(10),
                  paddingTop: normalize(20),
                }}
              >
                <Text style={styles.bannerText}>{t("hireA")}</Text>
                <Text style={styles.bannerText}>{t("combineHarvester")}</Text>
                <Buttons
                  type="nonrounded"
                  title={t("hire")}
                  headerBtn={true}
                  extendedPadding="large"
                  onClick={() => props.navigation.navigate("RequestService", { data: servicesList.harvester })}
                />
              </View>
            </View>
          </View>
        </View>
        {/* Banner Ends  */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginBottom: normalize(80),
            marginTop: normalize(10),
          }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Grid Layout Start */}
          <View style={styles.grid}>
            {/* <Text style={styles.bannerTextHeader}>Other Services</Text> */}
            <Buttons
              type="nonrounded"
              title={t("services")}
              extendedPadding="normal"
            />
            <View style={styles.listContainer}>
              {servicesType.services.map((item) =>
                ServiceTile(servicesList[item])
              )}
              
              {servicesType.products.map((item) =>
                ServiceTile(servicesList[item], true)
              )}
            </View>

          </View>
          {/* Grid ends */}
        </ScrollView>
      </View>
    </HomeLayout>
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

const Row = ({ children }) => {
  return <View style={styles.row}>{children}</View>;
};
const Col = ({ children }) => {
  return <View style={styles.col}>{children}</View>;
};

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

export default Discover;

const styles = StyleSheet.create({
  cardTileTextHeader: {
    fontFamily: font.MontserratBold,
    color: farmerColor.tabBarIconColor,
    fontSize: normalize(15),
  },
  cardTileTextSub: {
    fontFamily: font.MontserratBold,
    color: farmerColor.lightGreen,
    fontSize: normalize(10),
  },
  col: {
    flex: 1,
  },
  grid: {
    flexGrow: 1,
    marginHorizontal: "auto",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    marginVertical: normalize(8),
  },

  banner: { position: "relative" },
  bannerText: {
    fontFamily: font.MontserratBold,
    color: farmerColor.white,
    fontSize: normalize(20),
  },
  bannerTextHeader: {
    fontFamily: font.MontserratBold,
    color: farmerColor.tabBarIconColor,
    fontSize: normalize(30),
    marginVertical: normalize(10),
  },
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
  imageTile: {
    height: undefined,
    width: normalize(50),
    aspectRatio: 1,
    resizeMode: "contain",
  },
  imageCont: {
    position: "relative",
    borderRadius: normalize(10),
    padding: normalize(20),
    marginRight: "auto",
    backgroundColor: farmerColor.servicesBackground,
  },
  firstColor: {
    position: "absolute",
    right: normalize(42),
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
    left: normalize(46),
    borderTopRightRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    backgroundColor: farmerColor.servicesBackground2,
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
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: normalize(14),
  },
});
