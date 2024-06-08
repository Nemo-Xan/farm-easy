import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppBar from "../../components/home/AppBar";
import { normalize } from "../../services";
import colors, { farmerColor } from "../../constants/colors";
import fonts from "../../constants/fonts";
import Buttons from "../../components/home/Buttons.components";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { locationSelectors } from "../../store/reducers/locationSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { ShowToast } from "../../services/toastConfig";
import {
  measurementActions,
} from "../../store/reducers/measurementSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { authSelectors } from "../../store/reducers/authSlice";
import { userTypes } from "../../constants/users";
import { loaderActions } from "../../store/reducers/loaderSlice";
import { putFarmMeasurement } from "../../requests/agent";
import OfflineCheck from "../../services/network";
import MapTutorial from "../../components/MapTutorial";
import { handleError } from "../../requests";
import { useTranslation } from "react-i18next";

const LandMeasurement = (props) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const coords = useSelector(locationSelectors.selectCoords);
  const accessGranted = useSelector(locationSelectors.selectAccessGranted)
  const role = useSelector(authSelectors.selectRole)
  const [region, setRegion] = useState(coords)
  const [markers, setMarkers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [tutorial, setTutorial] = useState(false)
  const params = props.route.params
  
  useFocusEffect( 
    useCallback(() => {
      if (!accessGranted) {
        ShowToast.error(t("cannotUseMap"))
      }
    }, [])
  )

  const addMarker = () => {
    if (!accessGranted) {
      ShowToast.error(t("cannotUseMap"))
      return 
    }
    
    let currentMarkers = markers;
    currentMarkers.push(region);
    setMarkers(currentMarkers);
    setRefresh(!refresh);
    ShowToast.info(t("pinAdded"));
  };

  const onDragEnd = (e, i) => {
    let currentMarkers = markers;
    currentMarkers[i] = e.nativeEvent.coordinate;
    setMarkers(currentMarkers);
    setRefresh(!refresh);
  };

  const refreshMap = (input) => {
    setMarkers([]);
    input && ShowToast.info(t("markersCleared"));
    setRefresh(!refresh);
  };

  const generateFarm = async () => {
    if (!farmName) {
      ShowToast.error(t("provideFarmName"));
      return;
    }

    if (markers.length < 4) {
      ShowToast.error(t("select4Pins"));
      return;
    }
    
    const size = Number(calculateMapArea(markers)).toFixed(3)
    const body = {
      name: farmName,
      size: Number(size) == 0 ? "2.34" : size,
    };

    dispatch(measurementActions.addMeasurements(body));
    ShowToast.success(t("measurementRecorded"));
    addFarmSizeToRequest(size)
    refreshMap();
    setFarmName("");
  };

  const addFarmSizeToRequest = async (size) => {   
    try {
      console.log(params)
      const { request, service, request_id, price } = params
      
      if (await OfflineCheck()) {
        ShowToast.error(t("offline"));
        return;
      }

      dispatch(loaderActions.setLoading(true));

      putFarmMeasurement({ request_id, farm_size: size})
        .then(res => {
          console.log(res.data)
          if (res.data.success) {
            // ShowToast.success(res.data.message)
            props.navigation.navigate("PaymentSummary", { request_id, request, service, size, price })
          } else {
            ShowToast.error(res.data.message)
          }
        })
        .catch(handleError)
        .finally(() => {
          dispatch(loaderActions.setLoading(false));
        });

    } catch (e){
      if (role === userTypes.agent) {
        // ShowToast.error("Please select service request first")
        console.log(t("selectServiceRequestFirst"))
        
      }
    }
  }

  const navToFarmList = () => {
    try {
      console.log(params)
      const { request, service, request_id, price } = params
      props.navigation.navigate("MapStack", { 
        screen: "FarmList", 
        params: { 
          request_id, 
          request, 
          service, 
          price 
        }
      })
    } catch {
      props.navigation.navigate("FarmList");
    }
  }

  const bottomSection = () => {
    return (
      <LinearGradient
        colors={[farmerColor.backgroundColor, farmerColor.bgBlue]}
        style={{
          height: normalize(230),
          backgroundColor: farmerColor.bgBlue,
          borderTopLeftRadius: normalize(40),
          borderTopRightRadius: normalize(40),
          padding: normalize(25),
          elevation: 10,
          marginTop: -normalize(40),
        }}
      >
        <TouchableOpacity onPress={() => setTutorial(true)} style={styles.info}>
          <Icon
            name="information-circle-outline"
            color={farmerColor.white}
            size={normalize(22)}
            style={{
              // paddingVertical: normalize(10),
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addMarker()} style={styles.topIcon}>
          <Icon style={{ color: "white" }} name="add" size={normalize(25)} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => refreshMap(true)}
          style={[styles.topIcon, { right: normalize(40) }]}
        >
          <Icon
            style={{ color: "white" }}
            name="refresh"
            size={normalize(25)}
          />
        </TouchableOpacity>
        <TextInput
          style={{
            backgroundColor: farmerColor.white,
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(25),
            borderRadius: normalize(10),
            fontFamily: fonts.MontserratSemiBold,
          }}
          placeholder={t("typeFarmName")}
          placeholderTextColor={farmerColor.starEmptyColor}
          value={farmName}
          onChangeText={(text) => setFarmName(text)}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: normalize(10),
          }}
        >
          <View style={{ maxWidth: "60%" }}>
            <Buttons
              type="nonrounded"
              title={role === userTypes.agent ? t("proceed"): t("generateFarmSize")}
              extendedPadding="normal"
              onClick={() => generateFarm()}
            />
          </View>
          <View style={{ maxWidth: "40%"}}>
            <Buttons
              type="nonrounded"
              title={t("myFarms")}
              extendedPadding="normal"
              onClick={() => navToFarmList()}
            />
          </View>
        </View>
      </LinearGradient>
    );
  };

  const displayPolygon = () => {
    if (markers.length < 4 ) return null
    
    return (
      <MapView.Polygon 
        coordinates={[...markers]}
        strokeWidth={1}
        strokeColor="blue"
        fillColor={'rgba(0, 255, 47, 0.2)'}
      />
    )
  }

  return (
    <View style={styles.container}>
      {tutorial && <MapTutorial visible={tutorial} setVisible={setTutorial} role={role}/>}
      <View style={styles.appbarcontainer}>
        <AppBar
          showIcon={false}
          showNotif={true}
          backIconAlt={true}
          image={true}
          {...props}
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={{ flex: 1 }}
          // mapType="satellite"
          onRegionChangeComplete={item => setRegion(item)}
          initialRegion={
            coords?.latitude
              ? { ...coords, latitudeDelta: 0.0200, longitudeDelta: 0.0110 }
              : null
          }
        >
          {markers.map((marker, i) => (
            <Marker
              key={i}
              draggable
              coordinate={marker}
              onDragEnd={(e) => onDragEnd(e, i)}
            />
          ))}
          {displayPolygon()}
        </MapView>
      </View>
      {bottomSection()}
    </View>
  );
};

export default LandMeasurement;

function calculateMapArea(locations) {
  // let locations = input.region
  if (!locations.length) {    
      return 0;
  }
  if (locations.length < 3) {
    return 0;
  }
  let radius = 6371000;

  const diameter = radius * 2;
  const circumference = diameter * Math.PI;
  const listY = [];
  const listX = [];
  const listArea = [];
  // calculate segment x and y in degrees for each point

  const latitudeRef = locations[0].latitude;
  const longitudeRef = locations[0].longitude;
  for (let i = 1; i < locations.length; i++) {
    let latitude = locations[i].latitude;
    let longitude = locations[i].longitude;
    listY.push(calculateYSegment(latitudeRef, latitude, circumference));
    listX.push(calculateXSegment(longitudeRef, longitude, latitude, circumference));
  }

    // calculate areas for each triangle segment
  for (let i = 1; i < listX.length; i++) {
    let x1 = listX[i - 1];
    let y1 = listY[i - 1];
    let x2 = listX[i];
    let y2 = listY[i];
    listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));

    }
  // sum areas of all triangle segments
  let areasSum = 0;
  listArea.forEach(area => areasSum = areasSum + area)
  
  // get abolute value of area, it can't be negative
  let areaCalc = Math.abs(areasSum);// Math.sqrt(areasSum * areasSum);  
  return (areaCalc / 10000);
}

function calculateAreaInSquareMeters(x1, x2, y1, y2) {
  return (y1 * x2 - x1 * y2) / 2;
}
function calculateYSegment(latitudeRef, latitude, circumference) {
  return (latitude - latitudeRef) * circumference / 360.0;
}
function calculateXSegment(longitudeRef, longitude, latitude, circumference)     {
  return (longitude - longitudeRef) * circumference * Math.cos((latitude * (Math.PI / 180))) / 360.0;
}

const styles = StyleSheet.create({
  containe1r: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
    justifyContent: "space-between",
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  appbarcontainer: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: farmerColor.backgroundColor
  },
  topIcon: {
    backgroundColor: colors.green,
    width: normalize(50),
    height: normalize(45),
    position: "absolute",
    bottom: normalize(230),
    right: normalize(105),
    borderTopRightRadius: normalize(15),
    borderTopLeftRadius: normalize(15),
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    position: "absolute",
    top: -normalize(50),
    left: normalize(20),
    padding: normalize(8),
    backgroundColor: farmerColor.lightGreen,
    borderRadius: normalize(10),
    elevation: 3,
  }
});
