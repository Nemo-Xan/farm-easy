import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalLoader: false
}

export const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.globalLoader = action.payload
      }
    }
})

export const loaderActions = loaderSlice.actions
export const loaderSelectors = {
    selectGlobalLoader: state => state.loader.globalLoader
}

export default loaderSlice.reducer