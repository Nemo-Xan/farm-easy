import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { normalize } from "../../services";
import AppBar from "../../components/home/AppBar";
import { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import ScrollViewLayout from "../../components/ScrollViewLayout";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../store/reducers/authSlice";
import { userTypes } from "../../constants/users";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "../../constants/images";
import { useTranslation } from "react-i18next";

let trans = () => {}
const Profile = (props) => {
  const {t} = useTranslation()
  const authUser = useSelector(authSelectors.selectAuth);
  const role = authUser.role;

  useEffect(() => {
    // console.log(authUser)
    trans = t
  }, []);

  const ProfileDetails = (key, value, array) => {
    if (array) {
      try {
        return (
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.key}>{key}</Text>
            {value.map((item, index) => 
              <Text key={item} style={styles.value}>
                {index + 1}.) {t(item) || "-"}
              </Text>
            )}
          </View>
        );
      } catch {
        <View style={{ marginTop: normalize(20) }}>
          <Text style={styles.key}>{key}</Text>
          <Text style={styles.value}>
            {"-"}
          </Text>
        </View>
      }
    }
    return (
      <View style={{ marginTop: normalize(20) }}>
        <Text style={styles.key}>{key}</Text>
        <Text style={styles.value}>
          {value || "-"}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      style={styles.root}
      colors={[farmerColor.backgroundColor, farmerColor.bgBlue]}
    >
      <View style={styles.container}>
        <AppBar
          greenBg={true}
          {...props}
          text={t("yourProfile")}
          removeBack={true}
          wallet={role === userTypes.farmer ? false : true}
        />
      </View>
      <View style={styles.banner}>
        <Image 
          source={images.profileBackground}
          style={{height: "100%", width: "100%", resizeMode: "cover"}}
        />
      </View>
      <View style={styles.image}>
        <Image
          style={styles.imageBanner}
          source={images.profileImage}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.horizontalLine}>
            <Text style={styles.name}>{authUser.user?.name}</Text>
            <Text style={styles.title}>
              {t(role == userTypes.farmer
                ? "farmer"
                : role === userTypes.serviceProvider
                ? "serviceProvider"
                : role === userTypes.agent && "agent").toUpperCase()}
            </Text>
          </View>
          {ProfileDetails(t("emailAddress"), authUser.profile?.email)}
          {ProfileDetails(t("location"), authUser.profile?.location)}
          {role === userTypes.farmer && (
            <>
              {ProfileDetails(t("farmName"), authUser.profile?.business_name)}
              {ProfileDetails(t("Crop Types"), authUser.profile?.farm_type, true)}
            </>
          )}
          {/* {role === userTypes.serviceProvider && (
            <>
              {ProfileDetails("Services", authUser.profile?.service_type, true)}
            </>
          )} */}
          {role != userTypes.farmer && (
            <>
              {ProfileDetails(t("bank"), authUser.profile?.bank_name)}
              {ProfileDetails(t("accountName"), authUser.profile?.account_name)}
              {ProfileDetails(
                t("accountNumber"),
                authUser.profile?.account_number
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View
        style={{ marginBottom: normalize(20), marginHorizontal: normalize(20) }}
      >
        <Buttons
          type="nonrounded"
          title={t("edit")}
          extendedPadding="normal"
          icon={true}
          onClick={() => {
            props.navigation.navigate("EditProfile");
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: normalize(80),
    backgroundColor: farmerColor.backgroundColor,
  },
  container: {
    marginTop: normalize(20),
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
    // position: "absolute",
    // top: "45%",
    borderRadius: normalize(8),
    borderWidth: 4,
    borderColor: farmerColor.white,
    elevation: 10,
    marginTop: -normalize(60),
  },
  imageBanner: {
    height: normalize(90),
    width: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: normalize(10),
    padding: normalize(20),
  },
  content: {
    marginVertical: normalize(10),
    marginHorizontal: normalize(20),
  },
  horizontalLine: {
    borderBottomColor: farmerColor.tabBarIconColor,
    borderBottomWidth: 1,
    paddingVertical: normalize(10),
    marginVertical: normalize(10),
  },
  name: {
    fontFamily: fonts.MontserratExtraBold,
    color: farmerColor.tabBarIconColor,
    fontSize: normalize(25),
  },
  title: {
    fontFamily: fonts.MontserratExtraBold,
    color: farmerColor.tabBarIconColor,
    fontSize: normalize(15),
  },
  key: {
    fontFamily: fonts.MontserratSemiBold,
    color: farmerColor.tabBarIconSelectedColor,
    fontSize: normalize(14),
  },
  value: {
    fontFamily: fonts.MontserratSemiBold,
    color: farmerColor.tabBarIconColor,
    fontSize: normalize(16),
  },
});
