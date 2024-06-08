import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import HomeLayout from "../farmer/HomeLayout";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import CustomButtons from "../../components/home/CustomButtons";
import fonts from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import OfflineCheck from "../../services/network";
import { ShowToast } from "../../services/toastConfig";
import { getFarmHistory, postRequestService } from "../../requests/farmer";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../store/reducers/authSlice";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { farmerActions } from "../../store/reducers/farmerSlice";
import { userTypes } from "../../constants/users"
import { images } from "../../constants/images";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const RequestService = (props) => {
  const { data } = props.route.params;
  const {t} = useTranslation()
  const user = useSelector(authSelectors.selectUser)
  const profile = useSelector(authSelectors.selectProfile)
  const role = useSelector(authSelectors.selectRole)
  const dispatch = useDispatch();

  useEffect(() => {
    
  }, [])

  const requestService = async () => {
    if (await OfflineCheck()) {
      ShowToast.error("Offline");
      return;
    }

    if (!profile.location || !profile.address) {
      ShowToast.error("Please complete profile setup")
      props.navigation.pop()
      props.navigation.navigate("Profile")
      props.navigation.navigate("EditProfile", { showErrors: true });
      return
    }

    if (role === userTypes.agent) {
      if (!profile.email) {
        ShowToast.error("Please complete profile setup")
        props.navigation.pop()
        props.navigation.navigate("Profile")
        props.navigation.navigate("EditProfile", { showErrors: true });
        return
      }
    }

    dispatch(loaderActions.setLoading(true));

    postRequestService(data.url || data.name)
      .then((res) => {
        console.log(res.data);
        if (res.data.code === 200 && res.data.success) {
          getFarmHistory().then((res) => {
            dispatch(farmerActions.setRequests(res.data.data));
          });
          props.navigation.navigate("RequestConfirmation", {
            res: res.data.message,
            data,
          });
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  };

  return (
    <HomeLayout gradient={true} backIconAlt={true} showNotif={true} {...props}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: "auto",
          marginVertical: normalize(150),
        }}
      >
        <View style={[styles.imageCont]}>
          <View style={styles.firstColor} />
          <View style={styles.secondColor} />
          <Image
            resizeMode="contain"
            style={styles.imageTileHomePage2}
            source={data.image}
          />
        </View>
        <View style={{ width: "60%", marginTop: normalize(20) }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.MontserratSemiBold,
              color: colors.darkGreen,
              fontSize: normalize(16),
            }}
          >
            {
              data.image === images.extension || data.image === images.offtaker ?
              t(`requestConfirm-special`) + t(data.full) + t("request-special") :
              data.quantity ?
              t(`requestConfirm-quantity`) + t(data.full) + t("request-quantity") :
              t(`requestConfirm-service`) + t(data.full) + t("request-service")
            }
            {
              // data.image === images.extension ? 
              // "You will now request for Extension service": 
              // data.image === images.offtaker ? "You will now request for an "+ data.full:
              // data.quantity ?
              // `You will now request for ${data.full + ((data.image == images.seed) ? "s":"")}. Please confirm request`:
              // `You will now request for the ${data.full} service. Please confirm request`
            }
            
          </Text>
          <View
            style={{
              marginVertical: normalize(20),
              alignItems: "center",
              width: "100%",
            }}
          >
            <Buttons
              type="nonrounded"
              title={t("proceed")}
              extendedPadding="large"
              onClick={() => {
                // props.navigation.navigate("RequestConfirmation");
                requestService();
              }}
            />
          </View>
        </View>
      </View>
    </HomeLayout>
  );
};

export default RequestService;

const styles = StyleSheet.create({
  imageTileHomePage2: {
    height: undefined,
    width: normalize(60),
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: normalize(10),
  },
  imageCont: {
    position: "relative",
    borderRadius: normalize(10),
    padding: normalize(20),
    // marginRight: 'auto',
    backgroundColor: farmerColor.servicesBackground,
  },
  firstColor: {
    position: "absolute",
    right: normalize(50),
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
    left: normalize(50),
    borderTopRightRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    backgroundColor: farmerColor.servicesBackground2,
  },
});
