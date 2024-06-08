import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import { farmerColor } from '../constants/colors';
import fonts from '../constants/fonts';
import { normalize } from '../services'
import ScrollViewLayout from './ScrollViewLayout';

export default function MapTutorial({visible, setVisible, text, role}) {
  const {t} = useTranslation()
    // const scheme = useColorScheme()

    useEffect(() => {

        if (Platform.OS === 'web') {
            if (visible) {
                setVisible(false)
                alert(text)
            }
        }
    })

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
                <View style={styles.header}>
                  <TouchableOpacity style={styles.cancelContainer} onPress={() => setVisible(false)}>
                    <Icon
                      name="close-sharp"
                      color={"black"}
                      size={normalize(25)}
                      style={{
                        // paddingVertical: normalize(10),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollViewLayout>
                  <View style={[styles.content]}>
                      <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: farmerColor.tabBarIconSelectedColor
                      }}>
                        <Text style={[styles.text, { textAlign: "center", marginVertical: normalize(8)}]}>
                          {t("mapGuideTitle")}
                        </Text>
                      </View>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.text}>
                      {t("mapGuideIntro")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step1")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step1Text")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step2")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step2Text")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step3")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step3Text")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step4")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step4Text")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step5")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step5Text")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step6")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step6Text")}
                      </Text>
                      <View style={{margin: normalize(8)}} />
                      <Text style={styles.title}>
                        {t("step7")}
                      </Text>
                      <Text style={styles.text}>
                        {t("step7Text")}
                      </Text>
                  </View>
                </ScrollViewLayout>
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
      width: '90%',
      height: '70%',
      padding: normalize(16),
      paddingVertical: normalize(16),
      paddingHorizontal: normalize(22),
      backgroundColor: "white",
      borderRadius: normalize(20),
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
    content: {
      marginHorizontal: normalize(20)
    },
    title: {
      fontFamily: fonts.MontserratBold,
      fontSize: normalize(16),
      // marginVertical: normalize(8),
      color: farmerColor.tabBarIconColor,
    },
    text: {
      fontFamily: fonts.MontserratSemiBold,
      fontSize: normalize(16),
      // marginVertical: normalize(8),
      color: farmerColor.tabBarIconColor,
    }
})