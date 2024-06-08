import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, Pressable } from 'react-native'
import { farmerColor } from '../constants/colors';
import { Paystack } from "react-native-paystack-webview";
import fonts from '../constants/fonts';
import { formatCurrency, normalize } from '../services'

export default function PaystackModal({amount, email, visible, setVisible, callbacks}) {
    // const scheme = useColorScheme()

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
            <View style={styles.main}>
              <Paystack
                paystackKey="pk_test_ea93437461f724c21110c8f3e375683f4a1f5bc9"
                amount={amount}
                billingEmail={email}
                activityIndicatorColor="green"
                onCancel={callbacks[1]}
                onSuccess={callbacks[0]}
                autoStart={true}
                // currency={formatCurrency().sign}
              />
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
      flex: 1,
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