import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, Pressable } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import { farmerColor } from '../constants/colors';
import fonts from '../constants/fonts';
import { servicesList } from '../constants/services';
import { normalize } from '../services'
import Buttons from './home/Buttons.components';

export default function MultipleSelect({visible, setVisible, text, data, selected, setSelected, callback}) {
  const [refresh, setRefresh] = useState(false)
  const {t} = useTranslation()

    if (Platform.OS === 'web') {
        return (
            <View></View>
        )
    }

    const editSelection = (item) => {
      
      const active = selected.findIndex(obj => obj === item)
      if (active < 0) {
        setSelected([...selected, item])
      } else {
        let copy = selected
        setSelected(copy.filter(obj => obj != item))
      }
      setRefresh(false)
    }

    const option = (item) => {
      const value = item.full || item
      const active = selected.find(obj => obj === value)

      const extra = active ? styles.selected: {}
      const extraText = active ? styles.selectedText: {}
      return (
        <TouchableOpacity
          style={[styles.option]}
          onPress={() => editSelection(value)}
          key={value}
        >
          <Text style={[styles.text]}>
            {t(value)}
          </Text>
          {active &&
          <Icon
            name="checkmark-sharp"
            size={normalize(20)}
            color={farmerColor.lightGreen}
          />
          }
        </TouchableOpacity>
      )
    }

    const displayOptions = () => {
      let todisplay = []
      data.forEach((item, index) => {
        todisplay.push(option(item))
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
            onPress={(event) => {
              if (event.target == event.currentTarget) 
                if (callback) callback() 
                else setVisible(false)
            }}
          >
            <View style={styles.main}>
              <View style={{
                marginVertical: normalize(6)
              }}>
                {displayOptions()}
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
              <Buttons type="nonrounded" title={t("confirmSelection")} extendedPadding="normal" onClick={() => {
                if (callback) callback(true)
                else setVisible(false)
              }}/>
            </View>
          </Pressable>
        </Modal>
    )
}

export const MultipleSelectTrigger = ({
  title,
  colorAlt,
  errorMessage,
  setVisible,
  selected
}) => {
  const {t} = useTranslation()
  
  const inputStyle = colorAlt === true ? styles.inputColorWhite : styles.input;
  const errorBG = errorMessage ? styles.bgError : "";
  
  return (
    <View style={styles.inputContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.inputFontSize}>{t(title+ "s")}</Text>
        {errorMessage && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="information-circle-outline"
              color={farmerColor.cancelledColor}
              size={normalize(15)}
              style={{
                paddingVertical: normalize(8),
              }}
            />
            <Text style={styles.inputFontSizeError}>{errorMessage}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[inputStyle, errorBG, styles.selector]}
        onPress={() => setVisible(true)}
      >
        <Text style={{fontFamily: fonts.MontserratSemiBold}}>
          {selected.length > 0 ? `${selected.length} ${t(title+ "s")} ${t("selected")}` : ""}
        </Text>
        <Icon
          name="chevron-down-sharp"
          size={normalize(17)}
        />
      </TouchableOpacity>
    </View>
  );
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
      paddingHorizontal: normalize(40),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
      // borderBottomWidth: 1,
      // borderBottomColor: farmerColor.tabBarIconSelectedColor
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
      // fontFamily: fonts.MontserratExtraBold,
      // fontSize: normalize(18)
    },
    
  inputFontSize: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(16),
    marginVertical: normalize(8),
    color: farmerColor.tabBarIconSelectedColor,
  },
  inputFontSizeError: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: normalize(12),
    marginVertical: normalize(6),
    color: farmerColor.cancelledColor,
    marginLeft: normalize(4),
  },
  input: {
    fontFamily: fonts.MontserratSemiBold,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(18),
    backgroundColor: farmerColor.lighterGreen,
    borderRadius: normalize(8),
  },
  inputColorWhite: {
    fontFamily: fonts.MontserratSemiBold,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(18),
    backgroundColor: farmerColor.white,
    borderRadius: normalize(8),
  },
  bgError: { backgroundColor: farmerColor.errors },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})