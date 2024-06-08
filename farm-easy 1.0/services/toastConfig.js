import { View, Text, StyleSheet } from 'react-native'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { normalize } from '.';

/*
  1. Create the config
*/
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    true ?<BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15, backgroundColor: "#f4f4f4" }}
      text1Style={{
        fontSize: 17,
        // fontWeight: '400'
      }}
      text2Style={{
        fontSize: 15
      }}
    />:
    <View style={[styles.container, { borderBottomColor: "green"}]}>
      <MaterialIcons style={styles.icon} name="error-outline" size={normalize(30)} color="green" />
      <Text style={styles.textStyle}>{text2}</Text>
    </View>
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ height: "auto", borderLeftColor: "red", paddingVertical: 20, backgroundColor: "#f4f4f4"}}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoSuccess: ({ text1, props }) => (
    <View style={[styles.container, { borderBottomColor: "green"}]}>
      <MaterialIcons style={styles.icon} name="check-circle-outline" size={normalize(30)} color="green" />
      <Text style={styles.textStyle}>{text1}</Text>
    </View>
  ),
  tomatoError: ({ text1, props }) => (
    <View style={[styles.container, { borderBottomColor: "red"}]}>
      <MaterialIcons style={styles.icon} name="error-outline" size={normalize(30)} color="red" />
      <Text style={styles.textStyle}>{text1}</Text>
    </View>
  ),
  tomatoInfo: ({ text1, props }) => (
    <View style={[styles.container, { borderBottomColor: "gray"}]}>
      <MaterialIcons style={styles.icon} name="error-outline" size={normalize(30)} color="gray" />
      <Text style={styles.textStyle}>{text1}</Text>
    </View>
  )
};

export const ShowToast = {
  success: (text) => {
    Toast.hide()
    Toast.show({type: "tomatoSuccess", text1: text})
  },
  error: (text) => {
    Toast.hide()
    Toast.show({type: "tomatoError", text1: text})
  },
  info: (text) => {
    Toast.hide()
    Toast.show({type: "tomatoInfo", text1: text})
  },
  tomatoToast: (text) => {
    Toast.hide()
    Toast.show({type: "tomatoToast", text1: text})
  }
}

const styles = StyleSheet.create({
  container: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: normalize(8), 
    borderBottomWidth: normalize(5) ,
    borderBottomColor: "red",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: normalize(16),
    paddingRight: normalize(22),
    elevation: normalize(5),
    flexDirection: 'row'
  },
  
  textStyle: {
    flex: 1,
    textAlign: "center",
    marginLeft: normalize(10),
    fontSize: normalize(18),
    color: "rgb(40, 58, 53)",
    fontFamily: "PoppinsSemiBold",
  },

  icon: {
    marginLeft: normalize(12)
  }
})