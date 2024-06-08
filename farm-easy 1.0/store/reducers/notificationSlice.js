import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  refresh: false,
  wallet: [],
  refreshLanguage: true,
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
      setNotifications: (state, action) => {
        action.payload.reverse()
        state.notifications = action.payload
        state.refresh = !state.refresh
      }, 
      setWallet: (state, action) => {
        action.payload.reverse()
        state.wallet = action.payload
        state.refresh = !state.refresh
      },
      reset: () => {
        return initialState
      },
      refreshLanguage: (state, action) => {
        state.refreshLanguage = action.payload || !state.refreshLanguage
      }
    }
})

export const notificationActions = notificationSlice.actions
export const notificationSelectors = {
    selectNotifications: state => state.notification.notifications,
    selectWallet: state => state.notification.wallet,
    selectLanguage: state => state.notification.refreshLanguage
}

export default notificationSlice.reducer