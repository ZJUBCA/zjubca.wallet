import {secureStoreService} from './secure-store.service'

class AccountService {
  async getAccounts() {
    return await secureStoreService.getItem('accounts', [])
  }
}

export const accountService = new AccountService()
