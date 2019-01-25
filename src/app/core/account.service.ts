import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Account} from '../../classes/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private storage: Storage
  ) {
  }

  accounts: string[] = [];

  async fetchAccounts(): Promise<Account[]> {
    const res = await this.storage.get('accounts');
    console.log(res);
    if (res) {
      return JSON.parse(res);
    } else {
      return [];
    }
  }
}
