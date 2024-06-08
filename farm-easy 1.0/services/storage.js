import AsyncStorage from "@react-native-async-storage/async-storage";

export const setStorage = (key, value) => {
	AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key) => {
	const item = AsyncStorage.getItem(key);
	if (!item) {
		return null;
	}
	return JSON.parse(item);
};

export const clearStorage = (key) => {
	AsyncStorage.removeItem(key);
};