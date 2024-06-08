import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessGranted: false,
  timestamp: 0,
  coords: {},
  country: {
    code: "",
    name: ""
  },
}

export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
      setAccessGranted: (state, action) => {
        state.accessGranted = action.payload
      },
      setTimestamp: (state, action) => {
        state.timestamp = action.payload
      },
      setCountry: (state, action) => {
        state.country = action.payload
      },
      setCoords: (state, action) => {
        state.coords = action.payload
      },
      reset: () => {
        return initialState
      }
    }
})

export const locationActions = locationSlice.actions
export const locationSelectors = {
    selectAccessGranted: state => state.location.accessGranted,
    selectCountry: state => state.location.country,
    selectTimestamp: state => state.location.timestamp,
    selectCoords: state => state.location.coords,
}

export default locationSlice.reducer