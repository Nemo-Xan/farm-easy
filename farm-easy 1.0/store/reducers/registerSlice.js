import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    farmTypes: [],
    serviceTypes: [],
    countries: []
}

export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        setServiceTypes: (state, action) => {
            state.serviceTypes = action.payload
        },
        setFarmTypes: (state, action) => {
            state.farmTypes = action.payload.data
        },
        setCountries: (state, action) => {
            state.countries = action.payload
        },
        reset: (state, action) => {
            return initialState
        }
    }
})

export const registerActions = registerSlice.actions

export default registerSlice.reducer