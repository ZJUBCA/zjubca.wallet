class SecureStoreService {
  async getItem(key, fallbackValue = null) {
    const result = await Expo.SecureStore.getItemAsync(key)
    if (result === null) {
      return fallbackValue
    } else {
      return JSON.parse(result)
    }
  }
}

export const secureStoreService = new SecureStoreService()
