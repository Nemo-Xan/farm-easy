import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
  requests: [],
  prices: {},
  refresh: false
}

export const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {
      setPaymemts: (state, action) => {
        // action.payload.reverse()
        state.payments = action.payload
        state.refresh = !state.refresh
      }, 
      setPrices: (state, action) => {
        state.prices = action.payload
        state.refresh = !state.refresh
      }, 
      setRequests: (state, action) => {
        action.payload.reverse()
        state.requests = action.payload
        state.refresh = !state.refresh
      },
      reset: () => {
        return initialState
      }
    }
})

export const serviceActions = serviceSlice.actions
export const serviceSelectors = {
    selectPayments: state => state.service.payments,
    selectPrices: state => state.service.prices,
    selectRequests: state => state.service.requests,
}

export default serviceSlice.reducer