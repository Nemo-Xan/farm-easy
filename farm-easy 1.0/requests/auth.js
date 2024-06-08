import axiosClient from ".";

export const postLogin = ({phone, password}) => {
  return axiosClient.post('/authenticate', {
    phone,
    password
  })
}

export const getLogout = () => {
  return axiosClient.get('/logout')
}

export const getCountries = () => {
  return axiosClient.get('/countries')
}

export const postVerifyAccount = ({code}) => {
  return axiosClient.post('/verify', {
    code
  })
}

export const postForgotPassword = ({phone}) => {
  return axiosClient.post('/forgot_password', {
    phone
  })
}

export const postResetPassword = ({resetCode, phone, newPassword}) => {
  return axiosClient.post('/reset_password', {
    'reset_code': resetCode,
    phone,
    'new_password': newPassword
  })
}

export const getProfile = () => {
  return axiosClient.get('/profile')
}

export const putProfile = ( body ) => {
  console.log(body)
  return axiosClient.put('/profile', body)
}

export const getUser = () => {
  return axiosClient.get('/user')
}

export const getNotifications = (userType) => {
  return axiosClient.get(`/${userType}_notifications`)
}

export const getPrices = () => {
  return axiosClient.get('/prices')
}

export const deleteUser = ({ password }) => {
  return axiosClient.delete('/delete', { data: { password } })
}

export const postChangePassword = (body) => {
  return axiosClient.post('/change_password', body)
}