import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, ActivityIndicator } from 'react-native'
import { farmerColor } from '../constants/colors'
import { normalize } from '../services'
// import { GenStyles } from '../constants/Styles'
// import { useColorScheme } from 'react-native-appearance'
// import LottieView from 'lottie-react-native'
// import layout from '../constants/Layout'

let timeoutId = null
export default function Loader({visible, setVisible, text}) {
    // const scheme = useColorScheme()
    const [displayLoader , setDisplayLoader] = useState(false)

    useEffect(() => {

        if (Platform.OS === 'web') {
            if (visible) {
                setVisible(false)
                alert(text)
            }
        }

        // setDisplayLoader(false)
        // clearTimeout(timeoutId)
        if (visible) {
            console.log(timeoutId)
            if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    setDisplayLoader(true)
                }, 2000)
            } 
        } else {
            setDisplayLoader(false)
            if (timeoutId)  {
                clearTimeout(timeoutId)
                timeoutId = null
            }
        }
    }, [visible])

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
            <View style={styles.container}>
                {displayLoader &&
                <ActivityIndicator size={normalize(60)} color={farmerColor.whiteWithAlpha} />
                }
                {/* <View style={[styles.main]}>
                    <LottieView
                        style={{ height: 80, marginTop: -5 }}
                        loop
                        autoPlay
                        source={require('../assets/lottie/2867-tractor-animation.json')}
                    />
                    <Text>Loading</Text>
                </View> */}
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
        // width: '50%',
        // height: layout.width * 0.5,
        padding: 30,
        backgroundColor: 'rgba(230,230,230,1)',
        borderRadius: 6,
        elevation: 5
    },

    text: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 18
    },

    button: {
        padding: 8,
        backgroundColor: 'green',
        borderRadius: 25,
    },

    buttonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    }
})