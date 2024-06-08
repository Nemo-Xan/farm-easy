import * as Sentry from 'sentry-expo';

const debug = __DEV__ ? true: false

Sentry.init({
  dsn: 'https://4ee1f5560b71424796b5922d60bc477b@o4504003917709312.ingest.sentry.io/4504003926294528',
  enableInExpoDevelopment: false,
  debug, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export default Sentry