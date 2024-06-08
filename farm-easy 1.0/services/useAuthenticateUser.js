import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { authSelectors, authActions } from '../store/reducers/authSlice'
import { getProfile, getUser } from '../requests/auth'
import * as SplashScreen from 'expo-splash-screen';
import OfflineCheck from './network';

export default function useAuthenticateUser () {
  const [isAuthenticatingComplete, setIsAuthenticatingComplete] = useState(false)
  const authUser = useSelector(authSelectors.selectAuth)
  const dispatch = useDispatch()

  useEffect(() => {
    const authenticateUser = async () => {
      if (authUser.loggedIn) {
        
        if (await OfflineCheck()) {
          setIsAuthenticatingComplete(true)
          await SplashScreen.hideAsync()
          return
        }

        console.log(authUser.role)
        getUser()
          .then(res => {
            if (res.data.code == 200 && res.data.success) {
              console.log(res.data.data)
              dispatch(authActions.setUser(res.data.data))
              dispatch(authActions.setRole(res.data.data.user_type))
              getProfile()
                .then(res => {
                  console.log(res.data.data)
                  if (res.data.code === 200 && res.data.success) {
                    dispatch(authActions.setProfile(res.data.data))
                  }
                })
                .catch(err => {
                  console.log(err.response)
                  if (err.response?.status === 401) {
                    dispatch(authActions.logout())
                  }
                })
            } else {
              dispatch(authActions.logout())
            }
          })
          .catch(err => {
            console.log('error')
            console.log(err.response)
            if (err.response?.status == 401) {
              dispatch(authActions.logout())
            }
          })
          .finally(async () => {
            setIsAuthenticatingComplete(true)
            await SplashScreen.hideAsync()
          })
      } else {
        dispatch(authActions.logout())
        await SplashScreen.hideAsync()
        setIsAuthenticatingComplete(true)
      }
    }
    authenticateUser()
  }, [])

  return isAuthenticatingComplete
}