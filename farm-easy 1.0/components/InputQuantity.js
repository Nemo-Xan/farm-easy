import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, Pressable } from 'react-native'
import { farmerColor } from '../constants/colors';
import InputField from './InputField';
import fonts from '../constants/fonts';
import { normalize } from '../services'
import Buttons from './home/Buttons.components';
import { useTranslation } from 'react-i18next';

export default function InputQuantity({visible, setVisible, callback}) {
    // const scheme = useColorScheme()
    const {t} = useTranslation()
    const [quantity, setQuantity] = useState("")
    const [error, setError] = useState("")

    if (Platform.OS === 'web') {
        return (
            <View></View>
        )
    }

    const verify = async () => {
      setError("")
      if (!quantity) {
        setError(t("Required"))
        return
      }

      callback(quantity)
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            ariaHideApp={false}
        >
            <StatusBar hidden={false}/>
            <View style={styles.container}>
              <View style={styles.main}>
                <Text style={{
                  
                  fontFamily: fonts.MontserratSemiBold,
                  fontSize: normalize(20),
                  color: farmerColor.tabBarIconColor,
                  marginBottom: normalize(25),
                  // textAlign: "center",
                }}>{t("requestUpdateProvideQuantity")}</Text>
                <InputField
                  title={t("quantity")}
                  value={[quantity, setQuantity]}
                  number
                  errorMessage={error}
                />

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(20) }}>
                <Buttons type="nonrounded" title={t("proceed")} extendedPadding="normal" onClick={verify}/>
                <Buttons type="nonrounded" title={t("cancel")} extendedPadding="normal" onClick={() => setVisible(false)} color/>
              </View>
              </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    main: {
      width: "95%",
      padding: 30,
      backgroundColor: 'white',
      borderRadius: 6,
      elevation: 5
    },
    header: {
      alignItems: 'flex-end'
    },
    cancelContainer: {
      padding: normalize(8),
      backgroundColor: farmerColor.backgroundColor,
      borderRadius: normalize(12),
      elevation: 5
    },
    option: {
      paddingHorizontal: normalize(20),
      paddingVertical: normalize(12),
      borderBottomWidth: 1,
      borderBottomColor: farmerColor.tabBarIconSelectedColor
    },
    text: {
      fontFamily: fonts.MontserratBold,
      fontSize: normalize(16),
      // marginVertical: normalize(8),
      color: farmerColor.tabBarIconColor,
    },
    selected: {
      backgroundColor: farmerColor.backgroundColor
    }, 
    selectedText: {
      fontFamily: fonts.MontserratExtraBold,
      // fontSize: normalize(18)
    }
})