import {secureStoreService} from './secure-store.service'

class AccountService {
  async getAccounts() {
    return await secureStoreService.getItem('accounts', [])
  }
  async getCurrent() {
    return await secureStoreService.getItem('currentAccount')
  }
}

export const accountService = new AccountService()
