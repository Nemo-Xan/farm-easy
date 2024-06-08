import { useEffect } from "react";
import * as Location from 'expo-location'
import { Alert, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { locationActions, locationSelectors } from "../store/reducers/locationSlice";
import Sentry from "./useSentry";

export default function useLocation () {
  const dispatch = useDispatch()
  const accessGranted = useSelector(locationSelectors.selectAccessGranted)

  useEffect(() => {
    !accessGranted ? Alert.alert(
      "Location Permission",
      "The app requires location permission to get your country of residence and farm measurements",
      [
        {
          text: "Ok",
          onPress: () => getLocationAsync()
        }
      ]
    ): getLocationAsync()
  }, [])

  const getLocationAsync = async () => {
    let { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    console.log(status)
    if (status !== 'granted') {
      Alert.alert(
        "Location Permission",
        "Location request was cancelled. Please grant access to use location for the app to operate properly",
        [
          {
            text: "Ok",
            onPress: () => {
              !canAskAgain && Linking.openSettings();
              setTimeout(() => getLocationAsync(), 1000)
            }
          }
        ]
      )
      return;
    }

    dispatch(locationActions.setAccessGranted(true))

    let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
   
    Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }).then((res) => {
      const country = res[0]
      dispatch(locationActions.setCountry({name: country.country, code: country.isoCountryCode}))
    }).catch(e => {
      Sentry.Native.captureException(e, {infO: "Error getting country from location"})
      dispatch(locationActions.setCountry({name: "", code: ""}))
    });
    
    dispatch(locationActions.setTimestamp(location.timestamp))
    dispatch(locationActions.setCoords(location.coords))
  }
}