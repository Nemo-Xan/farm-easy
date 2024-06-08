import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";

const ButtonCustom = (props) => (
  <View>
    <Pressable onPress={props.onPress}>
      <Text {...props} style={styles.button}>
        {props.text}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "green",
    paddingTop: 10,
    width: "100%",
    textAlign: "center",
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginVertical: 10,
  },
});

export default ButtonCustom;
