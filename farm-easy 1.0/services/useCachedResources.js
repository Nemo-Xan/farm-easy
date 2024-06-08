import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Asset } from 'expo-asset';
import Images, {ImageObject, images} from '../constants/images'
import { FontList } from '../constants/fonts';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync();

        // Load fonts & Assets
        await Promise.all([
            Asset.loadAsync([...Images]),
            Asset.loadAsync([...Object.values(images)]),
            Asset.loadAsync([...Object.values(ImageObject)]),
            Font.loadAsync({
                ...Ionicons.font,
                ...FontList
            })
        ])


      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
