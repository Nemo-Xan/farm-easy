import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Updates from 'expo-updates'

export default function useUpdate () {
  const [checkingUpdate, setCheckingUpdate] = useState(false)

  useEffect(() => {
    monitorUpdates()
  }, [])

  const monitorUpdates = async () => {
    if (__DEV__) {
      setCheckingUpdate(false)
    } else {
      Updates.addListener(e => {
        // ToastAndroid.show(e.type, ToastAndroid.SHORT)
        if (e.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
          Alert.alert(
            "New Update Available",
            "A new version has been downloaded. The app will be reloaded",
            [
              { text: "OK", onPress: () => {
                // App is not reloading ??
                Updates.reloadAsync()
              } }
            ],
            { cancelable: false }
          )
        } else {
          setCheckingUpdate(false)
        }
      })
    }
  }

  return checkingUpdate
}