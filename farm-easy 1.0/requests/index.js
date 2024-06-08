import axios from 'axios'
import { ShowToast } from '../services/toastConfig'
import { authActions } from '../store/reducers/authSlice'
import i18n from '../locale'
import Sentry from '../services/useSentry'

export const api = 'http://fme.riceafrika.com/api'

const axiosClient = axios.create({
    baseURL: api,
})

let store

export const injectStore = _store => {
    store = _store
}

axiosClient.interceptors.request.use(function (config) {
    const auth = store.getState().auth

    config.headers.Authorization = auth.token ? `${auth.token}` : "";
    config.timeout = 4000
    return config;
});

export const setUpInterceptor = (auth) => {
}

export default axiosClient

export const handleError = err => {
    console.log(err.response || err);
    if (err.response?.status == 401) {
        store.dispatch(authActions.logout());
        ShowToast.error(i18n.t("unauthorized"))
    } else {
        if (err.response?.status >= 500) {
            try {
                Sentry.Native.captureException({
                    info: "500 error",
                    data: err.response || err
                })
            } catch {

            }
        }
        ShowToast.error(i18n.t("networkError"));
    }
}