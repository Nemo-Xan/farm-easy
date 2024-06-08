import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    Root: {
      path: 'app',
      screens: {
        Home: 'home',
        Services: 'services',
        AddService: 'addservice',
        GetService: 'getservice', 
        Notifications: 'notifications',
        Profile: 'profile',
        Settings: 'settings'
      },
    },
    Auth: {
      path: 'auth',
      screens: {
        Landing: 'landing',
        SignIn : 'login',
        Register : 'signup',
        PaymentAuth : 'paymentauth'
      },
    }

  },
};
