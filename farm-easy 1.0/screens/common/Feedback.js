import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import HomeLayout from "../farmer/HomeLayout";
import { normalize } from "../../services";
import CustomButtons from "../../components/home/CustomButtons";
import { ShowToast } from "../../services/toastConfig";
import { useDispatch } from "react-redux";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { postFeedback } from "../../requests/farmer";
import OfflineCheck from "../../services/network";
import { images } from "../../constants/images";
import { handleError } from "../../requests";
import Sentry from "../../services/useSentry";
import { useTranslation } from "react-i18next";

const Feedback = (props) => {
  const {t} = useTranslation()
  const [count, setCount] = useState(0);
  const [feedback, setfeedback] = useState("");
  const [starRating, setStarRating] = useState(0);
  const dispatch = useDispatch()

  const handleChange = (text) => {
    setfeedback(text.nativeEvent.text);
    setCount(text.nativeEvent.text.length);
  };

  const starIcon = (
    <Icon
      style={{ margin: normalize(10), color: farmerColor.starEmptyColor }}
      name="star-outline"
      size={normalize(30)}
    />
  );
  const starIconGold = (
    <Icon
      style={{ margin: normalize(10), color: farmerColor.starFilledColor }}
      name="star"
      size={normalize(30)}
    />
  );

  const check = (index) => {
    if (starRating >= index)
      return starIconGold
    else 
      return starIcon
  }
  
  const iconMaker = (icon, rating) => {
    return <TouchableOpacity onPress={() => setStarRating(rating)}>{icon}</TouchableOpacity>;
  };

  const submit = async () => {
    if (!feedback) {
      ShowToast.error(t("provideFeedbackDetails"))
      return
    }
    
    if (await OfflineCheck()) {
      ShowToast.error(t("offline"));
      return;
    }

    dispatch(loaderActions.setLoading(true));

    postFeedback({
      message: feedback
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.code === 200 && res.data.success) {
          ShowToast.success(t("feedbackSubmitted"))
          setfeedback("")
          Sentry.Native.captureEvent({
            info: "Feedback submitted",
            data: {
              feedback, starRating
            }
          })
        }
      })
      .catch(handleError)
      .finally(() => {
        dispatch(loaderActions.setLoading(false));
      });
  }

  return (
    <HomeLayout gradient={true} showIcon={false} {...props}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", marginVertical: normalize(15) }}>
        <Image
          source={images.greenHeart}
          style={{ width: normalize(20), height: normalize(20), marginRight: normalize(10) }}
        />
        <Text
          style={{
            fontFamily: fonts.MontserratBold,
            textAlign: "center",
            color: farmerColor.tabBarIconColor,
            marginTop: normalize(5),
            fontSize: normalize(20),
          }}
        >
          {t("feedback")}
        </Text>
      </View>
      <View>
        <TextInput
          multiline={true}
          numberOfLines={12}
          onChange={handleChange}
          placeholder={t("typeToUs")}
          value={feedback}
          maxLength={240}
          style={{
            alignItems: "flex-start",
            padding: normalize(20),
            backgroundColor: farmerColor.white,
            borderRadius: normalize(10),
            textAlignVertical: "top",
            fontFamily: fonts.MontserratMedium,
            fontSize: normalize(18),
          }}
          placeholderTextColor={farmerColor.tabBarIconSelectedColor}
        />
        <Text
          style={{
            fontFamily: fonts.MontserratMedium,
            textAlign: "right",
            color: farmerColor.tabBarIconSelectedColor,
            marginTop: normalize(5),
          }}
        >
          {count}/240 {t("words")}
        </Text>
      </View>
      <View style={{ marginVertical: normalize(40) }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: normalize(18),
            fontFamily: fonts.MontserratBold,
            color: farmerColor.tabBarIconSelectedColor,
          }}
        >
          {t("rateApp")}
        </Text>
        <View style={styles.starContainer}>
          {/* {Array(5).fill("1").map((value, index) => 
            {iconMaker(check(index), 4, index)}
          )} */}
          {iconMaker(check(0), 0)}
          {iconMaker(check(1), 1)}
          {iconMaker(check(2), 2)}
          {iconMaker(check(3), 3)}
          {iconMaker(check(4), 4)}
          {/* {iconMaker(starIconGold, 4)}
          {iconMaker(starIconGold, 4)}
          {iconMaker(starIcon, 4)} */}
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.green,
            paddingHorizontal: normalize(50),
            paddingVertical: normalize(14),
            borderRadius: normalize(10),
          }}
          onPress={() => submit()}
        >
          <Text style={{
            fontFamily: fonts.MontserratBold,
            color: colors.white,
            fontSize: normalize(14),
          }}>
            {t("submit")}
          </Text>
        </TouchableOpacity>
      </View>
      </>
      </TouchableWithoutFeedback>
    </HomeLayout>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
