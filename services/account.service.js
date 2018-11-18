import {secureStoreService} from './secure-store.service'

class AccountService {
  async getAccounts() {
    return await secureStoreService.getItem('accounts', true, [])
  }
  async getCurrent() {
    return await secureStoreService.getItem('currentAccount')
  }
  async setAccounts(accounts) {
    await secureStoreService.setItem('accounts', accounts)
  }
}

export const accountService = new AccountService()
