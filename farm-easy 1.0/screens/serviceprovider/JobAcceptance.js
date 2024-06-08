import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import HomeLayout from "../agent/HomeLayout";
import { normalize } from "../../services";
import fonts from "../../constants/fonts";
import { farmerColor } from "../../constants/colors";
import Buttons from "../../components/home/Buttons.components";
import Icon from "react-native-vector-icons/Ionicons";
import { useEffect } from "react";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { useDispatch } from "react-redux";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { getFarmRequest, putEndService, putStartService } from "../../requests/serviceProvider";
import { serviceActions } from "../../store/reducers/serviceSlice";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

let loaded = false
const JobAcceptance = (props) => {
  const {t} = useTranslation()
  const { item } = props.route.params
  const [startJob, setStartJob] = useState(props.route.params.startJob);
  const [endJob, setEndJob] = useState(props.route.params.endJob || false);
  const dispatch = useDispatch()

  let outerCircleStyle, innerCircleStyle;

  if (startJob === true) {
    outerCircleStyle = styles.outerOrange;
    innerCircleStyle = styles.innerOrange;
  }
  if (endJob === true) {
    outerCircleStyle = styles.outerEndJob;
    innerCircleStyle = styles.innerEndJob;
  }

  useEffect(() => {
  }, [])

  const getRequests = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    getFarmRequest()
      .then((res) => {
        console.log(res.data);
        if (res.data.success)
          dispatch(serviceActions.setRequests(res.data.data));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      });
  };

  const startService = async () => {
    if (startJob) return

    if (await OfflineCheck()) {
      ShowToast.error(t("offline"))
      return
    }

    dispatch(loaderActions.setLoading(true))

    putStartService(item.id)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          ShowToast.success(t("serviceStarted"))
          setStartJob(true)
          getRequests()
          // dispatch(notificationActions.setNotifications(res.data.data))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false))
      })
  }

  const endService = async () => {
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"))
      return
    }

    dispatch(loaderActions.setLoading(true))

    putEndService(item.id)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          setEndJob(true)
          getRequests()
          ShowToast.success(t("serviceCompleted"))
          // dispatch(notificationActions.setNotifications(res.data.data))
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false))
      })
  }

  const checkMarkIcon = (
    <Icon
      style={{ color: farmerColor.white }}
      name="checkmark"
      size={normalize(40)}
    />
  );
  return (
    <HomeLayout showIcon={false} showNotif={true} backIconAlt={true} {...props}>
      <View
        style={{
          flex: 1,
          marginTop: normalize(40),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: fonts.MontserratSemiBold,
            width: "50%",
            textAlign: "center",
            color: farmerColor.tabBarIconColor,
          }}
        >
          {t("clickStartEndJob")}
        </Text>

        <View style={[styles.outerCircle, outerCircleStyle]}>
          <TouchableOpacity 
            onPress={() => 
              // setStartJob(true)
              startService()
            }
          >
            <View style={[styles.innerCircle, innerCircleStyle]}>
              {!endJob && (
                <Text
                  style={{
                    fontFamily: fonts.MontserratBold,
                    fontSize: normalize(22),
                    color: farmerColor.white,
                  }}
                >
                  {t(startJob === true ? "progress" : "Start")}
                </Text>
              )}
              {endJob && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {checkMarkIcon}
                  <Text
                    style={{
                      fontFamily: fonts.MontserratBold,
                      fontSize: normalize(22),
                      color: farmerColor.white,
                    }}
                  >
                    {t("completed")}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {startJob && !endJob && (
          <View style={{ marginVertical: normalize(20) }}>
            <Buttons
              type="nonrounded"
              title={t("endJob")}
              extendedPadding="normal"
              onClick={() => endService()}
            />
          </View>
        )}
      </View>
    </HomeLayout>
  );
};

export default JobAcceptance;

const styles = StyleSheet.create({
  outerCircle: {
    backgroundColor: farmerColor.circleOuter,
    width: normalize(250),
    height: normalize(250),
    borderRadius: normalize(250 / 2),
    marginTop: normalize(50),
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    backgroundColor: farmerColor.lightGreen,
    width: normalize(200),
    height: normalize(200),
    borderRadius: normalize(200 / 2),
    justifyContent: "center",
    alignItems: "center",
  },

  outerOrange: {
    backgroundColor: farmerColor.inProgressAlpha,
  },
  innerOrange: {
    backgroundColor: farmerColor.inProgress,
  },

  outerEndJob: {
    backgroundColor: farmerColor.agentLandingPageGreenTabAlpha,
  },
  innerEndJob: {
    backgroundColor: farmerColor.agentLandingPageGreenTab,
  },
});
