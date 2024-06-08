import axiosClient from "."

export const postVerifyAgent = ({
  code,
  password,
  password_confirmation
}) => {
  return axiosClient.post('/verify_agent', {
    code,
    password,
    password_confirmation
  })
}

export const postBecomeAgent = ({
  phone,
  name,
  location,
  email,
  country,
  country_code,
  password
}) => {
  // return axiosClient.post('/become_agent', {
  return axiosClient.post('/become_an_agent', {
    phone,
    name,
    location,
    email,
    country,
    country_code,
    password
  })
}

export const getAllFarmerRequest = () => {
  return axiosClient.get('/all_farmer_request')
}

export const getFarmerServiceRequest = (serviceType) => {
  return axiosClient.get(`/all_farmer_${serviceType}_request`)
}

export const getAvailableServiceProvider = (serviceType) => {
  return axiosClient.get(`/${serviceType}_service_provider`)
}

export const putRequestServiceProvider = ({request_id, price, sp_id}) => {
  return axiosClient.put('/update_request_with_service_provider/' + request_id, {
    sp_id,
    price
  })
}

export const putFarmMeasurement = ({request_id, farm_size}) => {
  return axiosClient.put('/update_request_measurement/'+ request_id, { farm_size })
}

export const postPay = ({request_id}) => {
  return axiosClient.post('/pay', { request_id })
}

export const putPayment = ({request_id, reference}) => {
  return axiosClient.put(`/payment`, { reference, request_id })
}

export const getAgentTransaction = () => {
  return axiosClient.get('/all_agent_transaction')
}

export const putApproveRequest = ({request_id}) => {
  return axiosClient.put('/approve_request', { request_id })
}