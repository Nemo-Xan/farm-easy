import NetInfo from '@react-native-community/netinfo'

const OfflineCheck = async () => {
    let state = await NetInfo.fetch()

    return !state.isConnected
}

export default OfflineCheck
