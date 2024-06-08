import axiosClient from ".";

export const getServiceTypes = () => {
  return axiosClient.get('/all_service_types')
}

export const postSignupServiceProvider = ({
  country, 
  country_code,
  phone,
  name,
  service_type,
  password,
  password_confirmation
}) => {
  return axiosClient.post('/service', {
    country, 
    country_code,
    phone,
    name,
    service_type,
    password,
    password_confirmation
  })
}

export const getFarmRequest = () => {
  return axiosClient.get('/get_farm_request')
}

export const getAgentPayments = () => {
  return axiosClient.get('/get_agent_payment')
}

export const putAcceptRequest = (request_id) => {
  return axiosClient.put('/accept_request', { request_id })
}

export const putRejectRequest = (request_id) => {
  return axiosClient.put('/reject_request', { request_id })
}

export const putStartService = (request_id) => {
  return axiosClient.put('/start_service', { request_id })
}

export const putEndService = (request_id) => {
  return axiosClient.put('/end_service', { request_id })
}

export const getServiceNotifications = () => {
  return axiosClient.get('/service_notifications')
}

export const getServiceReadNotification = (id) => {
  return axiosClient.get('/service_read_notification')
}
