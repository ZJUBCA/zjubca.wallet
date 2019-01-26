import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Account} from '../../classes';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private storage: Storage
  ) {
    this.fetchAccounts();
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

  async saveAccounts(accounts: Account[]): Promise<any> {
    const exists = await this.fetchAccounts();
    accounts.forEach(item => {
      if (exists.indexOf(item) < 0) {
        exists.push(item);
      }
    });
    return await this.storage.set('accounts', JSON.stringify(exists));
  }
}
