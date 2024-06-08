import { Dimensions, Platform, PixelRatio } from "react-native";
import { currencies } from "../constants/currencies";
import locations from "../constants/locations";
// import { store } from "../requests";

const { width, height } = Dimensions.get("window");

const scale = width / 375;

let store

export const injectStoreToServices = _store => {
  store = _store
}

export const normalize = (size) => {
  /* 
    Dynamic font 
    
    */
  const newSize = size * scale;

  if (Platform.OS == "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const reSize = () => {
  
};

export const isEmail = (email) => {
  let emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) { return true; }
  
  return false;
}

export function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const formatCurrency = (amount) => {
  let currency
  try {
    const user = store.getState().auth.user
    let country = user.country
    // currency = currencies.TZ
    currency = currencies[country] || currencies.NG
  } catch {
    currency = currencies.NG
  }
  return {
    value: (amount || 0) * currency.value,
    sign: currency.sign
  }
}