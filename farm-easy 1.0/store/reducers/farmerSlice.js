import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  counts: {},
  refresh: false
}

export const farmerSlice = createSlice({
    name: "farmer",
    initialState,
    reducers: {
      setRequests: (state, action) => {
        action.payload.reverse()
        state.requests = action.payload
        state.refresh = !state.refresh
      }, 
      setCounts: (state, action) => {
        action.payload
        state.counts = action.payload
        state.refresh = !state.refresh
      }, 
      reset: () => {
        return initialState
      }
    }
})

export const farmerActions = farmerSlice.actions
export const farmerSelectors = {
    selectRequests: state => state.farmer.requests,
    selectCounts: state => state.farmer.counts,
}

export default farmerSlice.reducer