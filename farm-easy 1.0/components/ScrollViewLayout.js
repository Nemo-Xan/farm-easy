import { Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from "react-native"
import { normalize } from "../services";

const ScrollViewLayout = (props) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginVertical: normalize(10)}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={(event) => event.target === event.currentTarget && Keyboard.dismiss(event)}>
          <>
            {props.children}
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ScrollViewLayout