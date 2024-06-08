import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, Pressable, Image } from 'react-native'
import { farmerColor } from '../constants/colors';
import fonts from '../constants/fonts';
import { images } from '../constants/images';
import { normalize } from '../services'
import Buttons from './home/Buttons.components';

export default function DeleteService({visible, setVisible, callback}) {
  const {t} = useTranslation()

    if (Platform.OS === 'web') {
        return (
            <View></View>
        )
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
                <View style={{ marginBottom: normalize(30), alignItems: 'center', marginTop: normalize(10)}}>

                  <Image
                    source={images.pleadingFace}
                    style={{ width: normalize(30), height: normalize(30)}}
                  />
                </View>
                <Text style={{
                  
                  fontFamily: fonts.MontserratMedium,
                  fontSize: normalize(16),
                  color: farmerColor.tabBarIconColor,
                  marginBottom: normalize(25),
                  textAlign: 'center'
                  // textAlign: "center",
                }}>{t("removeService")}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(20) }}>
                  <Buttons type="nonrounded" title={t("cancel")} extendedPadding="normal" onClick={() => setVisible(false)} color/>
                  <Buttons type="nonrounded" title={t("proceed")} extendedPadding="normal" onClick={callback}/>
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
      width: "85%",
      padding: 30,
      backgroundColor: 'white',
      borderRadius: 16,
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