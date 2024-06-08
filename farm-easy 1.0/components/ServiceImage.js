import { View, Image, StyleSheet } from 'react-native'
import { farmerColor } from '../constants/colors'
import { normalize } from '../services'

export const ServiceImage = ({image, resize, alternate, marginRight}) => {
  return (
    <View style={[
      styles.imageCont, 
      resize ? 
      { padding: normalize(10)} : 
      alternate ?
      { padding: normalize(10)} :
      marginRight ?
      { marginRight: 0} :
      {}
    ]}>
      <View style={[
        styles.firstColor, 
        alternate ?
        { right: normalize(20)}: {}
      ]}/>
      <View style={[
        styles.secondColor,
        alternate ? 
        { left: normalize(25)}: {}
      ]} />
      <Image 
        resizeMode="contain" 
        style={[
          styles.imageTile, 
          alternate ? 
          { width: normalize(30)}:
          resize ? 
          { width: normalize(70)}: 
          {}
        ]} 
        source={image} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  imageTile: {
    height: undefined,
    width: normalize(50),
    aspectRatio: 1,
    resizeMode: "contain",
  },
  imageCont: {
    position: "relative",
    borderRadius: normalize(10),
    padding: normalize(20),
    marginRight: 'auto',
    backgroundColor: farmerColor.servicesBackground,
  },
  firstColor: {
    position: "absolute",
    right: normalize(42),
    top: 0,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: normalize(10),
    borderBottomLeftRadius: normalize(10),
    backgroundColor: farmerColor.servicesBackground
  },
  secondColor: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    left: normalize(45),
    borderTopRightRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    backgroundColor: farmerColor.servicesBackground2
  },
})