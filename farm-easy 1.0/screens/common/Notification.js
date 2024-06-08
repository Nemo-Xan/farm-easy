import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import HomeLayout from "../farmer/HomeLayout";
import { normalize } from "../../services";
import fonts from "../../constants/fonts";
import colors, { farmerColor } from "../../constants/colors";
import CustomButtons from "../../components/home/CustomButtons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { getNotifications } from "../../requests/auth";
import { authSelectors } from "../../store/reducers/authSlice";
import { userTypes } from "../../constants/users";
import TimeAgo from "react-native-timeago";
import { notificationActions, notificationSelectors } from "../../store/reducers/notificationSlice";
import { images } from "../../constants/images";
import moment from "moment"
import translate from "translate-google-api";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

let loaded = false
let firstLoad = true

const Notification = (props) => {
  const {t, i18n} = useTranslation()
  const dispatch = useDispatch()
  const role = useSelector(authSelectors.selectRole)
  const notifications = useSelector(notificationSelectors.selectNotifications)
  const refreshLanguage = useSelector(notificationSelectors.selectLanguage)
  
  useFocusEffect( 
    useCallback(() => {
      refreshNotifications()
    }, [])
  )
  
  const refreshNotifications = async () => {
    if (await OfflineCheck()) {
      ShowToast.error("Offline")
      return
    }

    !loaded && dispatch(loaderActions.setLoading(true))

    loaded = true
    let userType = ""
    Object.keys(userTypes).forEach(item => {
      if (userTypes[item] == role)
        userType = item
      if (role == userTypes.serviceProvider)
        userType = "service"
    })

    // add state to notification slice after language update
    // update noti state list after
    // 1. notif length change
    // 2. notif language change state update
    // reset language state after update
    // use bulk translate
    
    // -------PATIALLY DEPRECATED-----------

    getNotifications(userType)
      .then(async res => {
        if (res.data.success) {

          // console.log(refreshLanguage)
          if (notifications.length != res.data.data.length || firstLoad) {
            // if (refreshLanguage) dispatch(loaderActions.setLoading(true))

            firstLoad = false
            const toTranslate = []
            for (let i = 0; i < res.data.data.length; i++) {
              let item = res.data.data[i]
              let message = item.description
              toTranslate.push(message)
            }

            let result = await translate(toTranslate, { to: i18n.language})

            const translated = []
            for (let i = 0; i < res.data.data.length; i++) {
              let item = res.data.data[i]
              item.description = result[i]
              translated.push(item)
            }

            dispatch(notificationActions.setNotifications([...translated]))
            dispatch(notificationActions.refreshLanguage(false))
            console.log("translated")
          } else {
            // dispatch(notificationActions.setNotifications(res.data.data))
          }
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false))
      })
  }

  return (
    <>
      <HomeLayout
        {...props}
        showBackIcon={true}
        showLogo={true}
        settings={true}
        appbarColor="white"
        alternate={true}
      >
        <View style={{ marginTop: normalize(25) }}>
          <Text style={styles.headerText}>{t("notifications")}</Text>
        </View>
        {/* if no notification  show this below View*/}
        {notifications.length === 0 ?
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
            {t("noNotifications")}
          </Text>
        </View> :
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: normalize(15), marginTop: normalize(10) }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {notifications.map((item, i) =>
            NotificationTile(item, i)
          )}
        </ScrollView>
        }
      </HomeLayout>
      <View style={styles.footer}>
        <Image
          source={images.greenHeart}
          style={{ width: normalize(20), height: normalize(20) }}
        />
        <Text style={styles.footerText}>{t("enjoyingApp")}</Text>
        <Text style={styles.footerText}>{t("rateUsFeedback")}</Text>
        <CustomButtons
          {...props}
          style={styles.footerButton}
          title={t("saySomething")}
          type="2"
        />
      </View>
    </>
  );
};

const NotificationTile = (item, i) => {
  return (
    <View
      key={i}
      style={{
        backgroundColor: farmerColor.backgroundColor,
        marginTop: normalize(10),
        padding: normalize(25),
        paddingTop: normalize(10),
        paddingRight: normalize(10),
        // flexDirection: "row-reverse",
        borderRadius: normalize(10),
      }}
    >
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.MontserratRegular,
          fontSize: normalize(14),
          textAlign: "right"
        }}
      >
        {/* <TimeAgo time={getTime} /> */}
        {moment.utc(item.updated_at).local().startOf('seconds').fromNow()}
      </Text>
      <Text
        style={{
          flex: 4,
          fontFamily: fonts.MontserratSemiBold,
          color: farmerColor.tabBarIconColor,
          width: "80%",
        }}
      >
        {item.description}
      </Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  headerText: {
    textAlign: "center",
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(20),
    color: farmerColor.tabBarIconColor,
  },
  footer: {
    backgroundColor: colors.lightGreen,
    width: "100%",
    paddingVertical: normalize(22),
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    textAlign: "center",
    fontFamily: fonts.MontserratMedium,
    fontSize: normalize(14),
    color: colors.darkGreen,
  },
  footerButton: {
    marginTop: normalize(15),
  },
});
