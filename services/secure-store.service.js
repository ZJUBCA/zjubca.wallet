class SecureStoreService {
  async getItem(key, json = false, fallbackValue = null) {
    const result = await Expo.SecureStore.getItemAsync(key)
    if (result === null) {
      return fallbackValue
    } else {
      return json ? JSON.parse(result) : result
    }
  }
  async setItem(key, value, json = false) {
    await Expo.SecureStore.setItemAsync(key, json ? JSON.stringify(value) : value)
  }
}

export const secureStoreService = new SecureStoreService()
