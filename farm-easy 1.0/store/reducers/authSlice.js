import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    token: "",
    role: "",
    user: {},
    profile: {}
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state) => {
            state.loggedIn = true
        },
        logout: (state) => {
            state.loggedIn = initialState.loggedIn
            state.token = initialState.token
            state.role = initialState.role
            state.user = initialState.user
            state.profile = initialState.profile
            // state = initialState
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
        setProfile: (state, action) => {
            state.profile = action.payload
        },
        reset: () => {
            return initialState
        }
    }
})

export const authActions = authSlice.actions
export const authSelectors = {
    selectLoggedIn: state => state.auth.loggedIn,
    selectProfile: state => state.auth.profile,
    selectToken: state => state.auth.token,
    selectRole: state => state.auth.role,
    selectUser: state => state.auth.user,
    selectAuth: state => state.auth,
}

export default authSlice.reducer