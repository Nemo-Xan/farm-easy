import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
require("../locale")

export default function useLanguage () {
  const [settingLanguage, setSettingLanguage] = useState(true)

  useEffect(() => {
    configureLanguage()
  }, [])

  const configureLanguage = async () => {
    let firstLoad = await AsyncStorage.getItem("first-load-language")
    if (!firstLoad) {
      await AsyncStorage.setItem("show-language-modal", "yes")
    } else {
      await AsyncStorage.removeItem("show-language-modal")
    }

    setSettingLanguage(false)
  }

  return settingLanguage
}