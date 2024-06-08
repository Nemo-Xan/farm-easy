import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import imagesList, { images } from "../../constants/images";
import React, { useState } from "react";
import { normalize } from "../../services";
import { farmerColor } from "../../constants/colors";

import HomeLayout from "../agent/HomeLayout";
import ScrollViewLayout from "../../components/ScrollViewLayout";
import { ServiceImage } from "../../components/ServiceImage";
import fonts from "../../constants/fonts";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../store/reducers/authSlice";
import { servicesList } from "../../constants/services";
import MultipleSelect from "../../components/MultipleSelect";
import DeleteService from "../../components/DeleteService";
import { getProfile, putProfile } from "../../requests/auth";
import { ShowToast } from "../../services/toastConfig";
import OfflineCheck from "../../services/network";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { useTranslation } from "react-i18next";
import { handleError } from "../../requests";

const ServicesList = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const profile = useSelector(authSelectors.selectProfile)
  const [selectMulti, setSelectMulti] = useState(false)
  const [selected, setSelected] = useState(profile.service_type || [])
  const [remove, setRemove] = useState(false)
  const [selectedService, setSelectedService] = useState({})
  const [refresh, setRefresh] = useState(false)
  
  const Card = ({ title, avaliableText, icon, service }) => {
    return (
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: farmerColor.white,
          borderRadius: normalize(10),
          padding: normalize(20),
          paddingHorizontal: normalize(30),
          marginVertical: normalize(6),
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => {
          setSelectedService(title)
          setRemove(true)
        }}
      >
        <View>
          <ServiceImage image={icon} alternate />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: normalize(20),
            maxWidth: "80%",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.MontserratSemiBold,
              color: farmerColor.tabBarIconColor,
              fontSize: normalize(16),
            }}
          >
            {t(title)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const refreshData = () => {
    setRefresh(!refresh)
    getProfile().then((res) => {
      if (res.data?.code === 200 && res.data?.success) {
        dispatch(authActions.setProfile(res.data.data));
      }
    });
  };

  const callback = () => {
    console.log(selectedService)
    setRemove(false)
    const active = selected.findIndex(obj => obj === selectedService)
    if (active < 0) {
      // setSelected([...selected, item])
    } else {
      update(true, selected.filter(obj => obj != selectedService))
    }
  }

  const update = async (flag, extra) => {
    setSelectMulti(false)
    if (extra) setSelected(extra)
    if (flag) {
      const body = {
        location: profile.location,
        address: profile.address,
      };
  
      if (profile.email) {
        body.email = profile.email
      }
  
      if (profile.bank_name) {
        body.bank_name = profile.bank_name;
      }
      if (profile.account_name) {
        body.account_name = profile.account_name;
      }
      if (profile.account_number) {
        body.account_number = profile.account_number;
      }
  
      if (selected.length == 0) {
        ShowToast.error(t("mustSelectOneService"));
        setSelected(profile.service_type)
        return;
      }
  
      body.service_type = extra || selected

      if (await OfflineCheck()) {
        ShowToast.error(t("networkError"));
        setSelected(profile.service_type)
        return;
      }
      dispatch(loaderActions.setLoading(true));

      putProfile(body)
      .then(async (res) => {
        console.log(res.data);
        if (!res.data.success) {
          setSelected(profile.service_type)
          ShowToast.error(res.data.error);
        } else {
          ShowToast.success(t("serviceListUpdated"));
          refreshData();
        }
      })
      .catch((err) => {
        setSelected(profile.service_type)
        handleError(err)
      })
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
    } else {
      setSelected(profile.service_type)
    }
  }
  
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
        <Text
          style={{
            marginTop: normalize(10),
            fontFamily: fonts.MontserratBold,
            color: farmerColor.tabBarIconColor,
            fontSize: normalize(20),
          }}
        >
          {t("services")}
        </Text>
        <ScrollViewLayout>
          {profile.service_type?.map(item => {    
            try {
              let service = servicesList[item.toLowerCase()];
              if (!service) {
                service = Object.values(servicesList).find(obj => obj.full === item)
              }      
              
              return <Card
                key={item}
                title={item}
                icon={service.image}
              />
            } catch (e) {
              handleError(e)
              return <View></View>
            }
          })}
          
        </ScrollViewLayout>
        <TouchableOpacity style={styles.addService} onPress={() => setSelectMulti(true)}>
          <Icon
            style={{ color: farmerColor.white, marginLeft: 2 }}
            name="ios-add-circle-outline"
            size={normalize(34)}
          />
        </TouchableOpacity>
        {selectMulti && 
          <MultipleSelect 
            visible={selectMulti} 
            setVisible={setSelectMulti}
            selected={selected}
            setSelected={setSelected}
            data={Object.values(servicesList).filter(item => item.full != "Harvester")}
            callback={update}
          />
        }
        {remove &&
          <DeleteService
            visible={remove}
            setVisible={setRemove}
            callback={callback}
          />
        }
      </View>
    </HomeLayout>
  );
};

export default ServicesList;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: normalize(90)
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
  addService: {
    position: "absolute",
    bottom: normalize(30),
    right: normalize(20),
    padding: normalize(4),
    backgroundColor: farmerColor.servicesBackground,
    borderRadius: normalize(14)
  }
});
