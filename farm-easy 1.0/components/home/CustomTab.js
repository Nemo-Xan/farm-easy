import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomTab = () => {
  return (
    <View>
      <Text>CustomTab</Text>
    </View>
  )
}

export default CustomTab

const styles = StyleSheet.create({})


/* 

      <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{width: '90%',borderRadius:20, alignSelf:'center',marginVertical: 20,padding:30, position:'absolute', bottom: 10, flexDirection: 'row' ,backgroundColor: 'green' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, backgroundColor:'red', height: '100%' }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222',textAlign:'center'}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


*/