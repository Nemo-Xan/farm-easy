import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  measurements: []
}

export const measurementSlice = createSlice({
    name: "measurement",
    initialState,
    reducers: {
      setMeasurements: (state, action) => {
        state.measurements = action.payload
      },
      addMeasurements: (state, action) => {
        state.measurements.push(action.payload)
      },
      reset: () => {
        return initialState
      }
    }
})

export const measurementActions = measurementSlice.actions
export const measurementSelectors = {
    selectMeasurements: state => state.measurement.measurements
}

export default measurementSlice.reducer