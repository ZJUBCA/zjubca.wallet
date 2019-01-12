import { Injectable } from '@angular/core';
import {SecureStorage} from '@ionic-native/secure-storage/ngx'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private secureStorage: SecureStorage
  ) {
  
  }
  
  private storagePool = {}
  private async getStorage(store: string) {
    let storage = this.storagePool[store]
    if (!storage) {
      storage = await this.secureStorage.create(store)
      this.storagePool[store] = storage
    }
    return storage
  }
  
  accounts = []
  async fetchAccounts() {
    const storage = await this.getStorage('default')
    const keys = await storage.get('accounts')
  }
}
