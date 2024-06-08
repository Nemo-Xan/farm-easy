import { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";

import { NetworkProvider } from "react-native-offline"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import useCachedResources from './services/useCachedResources'
import { PersistGate } from "redux-persist/integration/react"
import { SafeAreaView } from "react-native-safe-area-context"
import * as SplashScreen from 'expo-splash-screen';
import NavigationComponent from "./navigation";
import useUpdate from "./services/useUpdate";
import { store, persistor} from './store'
import { injectStore } from "./requests"
import { injectStoreToServices, normalize } from "./services"
import { Provider } from "react-redux"
import * as Sentry from 'sentry-expo'
import useLanguage from "./services/useLanguage";

// add store access to axios config
injectStore(store)
injectStoreToServices(store)

// prolong splash screen
SplashScreen.preventAutoHideAsync();

const debug = __DEV__ ? true: false

Sentry.init({
  dsn: 'https://4ee1f5560b71424796b5922d60bc477b@o4504003917709312.ingest.sentry.io/4504003926294528',
  enableInExpoDevelopment: false,
  debug, // If `true`, Sentry will try to print out useful debugging information. Set it to `false` in production
});

// Provide global number format
Number.prototype.format = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

export default function App() {
  const isCachingComplete = useCachedResources()
  const settingLanguage = useLanguage()
  const checkingUpdate = useUpdate()

  if (!isCachingComplete || checkingUpdate || settingLanguage)
    return null

  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NetworkProvider>
            <NavigationComponent/>
          </NetworkProvider>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: normalize(40),
  },
});
