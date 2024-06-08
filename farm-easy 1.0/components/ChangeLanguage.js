import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, Pressable } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from 'react-redux';
import { farmerColor } from '../constants/colors';
import fonts from '../constants/fonts';
import { normalize } from '../services'
import { ShowToast } from '../services/toastConfig';
import { notificationActions } from '../store/reducers/notificationSlice';
import * as Updates from 'expo-updates'

const data = [["english", "en"], ["french", "fr"], ["hausa", "ha"], ["swahili", "sw"]]
// const data = [["english", "en"], ["hausa", 'ha'], ["swahili", "sw"], ["french", "fr"]]

export default function ChangeLanguage({visible, setVisible, selected, callback}) {
  const dispatch = useDispatch()
  const {t, i18n} = useTranslation()
    // const scheme = useColorScheme()

    if (Platform.OS === 'web') {
        return (
            <View></View>
        )
    }

    const updateLanguage = async (item) => {

      if (i18n.language != item[1]) {
        // ShowToast.success("Language changed")
        dispatch(notificationActions.refreshLanguage(true))
        i18n.changeLanguage(item[1])
        Updates.reloadAsync()
      }
      await AsyncStorage.setItem("@currentLanguage", item[1])
      setVisible(false)
      callback && callback()
    }

    const displayOptions = () => {
      let todisplay = []
      data.forEach((item, index) => {
        todisplay.push(option({item}))
        if (index < data.length - 1)
          todisplay.push(
            <View 
              key={index} 
              style={{ 
                height: 1,
                borderBottomWidth: 1,
                borderBottomColor: "#DCFAF3",
                marginHorizontal: normalize(20),
              }} 
            />
          )
      })

      return todisplay
    }

    const option = ({item}) => {
      return (
        <TouchableOpacity
          style={[styles.option]}
          key={item[1]}
          onPress={() => updateLanguage(item)}
        >
          <Text style={[styles.text]}>
            {t(item[0])}
          </Text>
          {selected == item[1] &&
            <Icon
              name="checkmark-sharp"
              size={normalize(20)}
              color={farmerColor.lightGreen}
            />
          }
        </TouchableOpacity>
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
            <Pressable 
              style={styles.container} 
              onPress={(event) => event.target == event.currentTarget && setVisible(false)}
            >
              <View style={styles.main}>
                <View style={{ marginVertical: normalize(6) }}>
                  <View
                    style={[styles.option, {paddingLeft: normalize(40), paddingRight: normalize(20)}]}
                  >
                    <Text style={[styles.text, {width: "100%", color: "#819F93"}]}>
                      {t("chooseLanguage")}
                    </Text>
                  </View>
                  <View 
                    style={{ 
                      height: 1,
                      borderBottomWidth: 1,
                      borderBottomColor: "#DCFAF3",
                      marginHorizontal: normalize(20),
                    }} 
                  />
                  {displayOptions()}
                </View>
              </View>
            </Pressable>
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
      width: '90%',
      backgroundColor: "white",
      borderRadius: normalize(16),
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
      paddingLeft: normalize(70),
      paddingRight: normalize(40),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    text: {
      fontFamily: fonts.MontserratSemiBold,
      fontSize: normalize(16),
      marginVertical: normalize(14),
      // marginVertical: normalize(8),
      color: farmerColor.tabBarIconColor,
      width: '80%'
    },
    selected: {
      backgroundColor: farmerColor.backgroundColor
    }, 
    selectedText: {
      fontFamily: fonts.MontserratExtraBold,
      // fontSize: normalize(18)
    }
})