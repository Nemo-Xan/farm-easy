import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // payments: [],
  requests: [],
  requestProviders: {},
  refresh: false
}

export const agentSlice = createSlice({
    name: "agent",
    initialState,
    reducers: {
      setRequestProviders: (state, action) => {
        state.requestProviders[action.payload.type] = action.payload.value
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

export const agentActions = agentSlice.actions
export const agentSelectors = {
    selectRequestProviders: state => state.agent.requestProviders,
    selectRequests: state => state.agent.requests,
}

export default agentSlice.reducer