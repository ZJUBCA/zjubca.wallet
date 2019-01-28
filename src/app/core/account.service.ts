import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Account} from '../../classes';
import {ACCOUNTS_KEY, CURRENT_ACC_KEY} from '../common/config';

/**
 * Notice:
 *
 * 为了节省存储空间，Storage仅存储三个字段：
 * - 'current' - 当前钱包所显示的账户名
 * - 'accounts' - 所有已存在本地的账户列表，类型为Array<string>
 * - 'name' => Account - 即以账户名为key，value为Account类型的键值对存储。
 */

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private storage: Storage,
  ) {
  }

  /**
   * setCurrent set the current live account name
   *
   * @param name
   */
  async setCurrent(name: string): Promise<any> {
    return await this.storage.set(CURRENT_ACC_KEY, name);
  }

  async current(): Promise<string> {
    const name = await this.storage.get(CURRENT_ACC_KEY);
    if (!name) {
      return null;
    } else {
      return name;
    }
  }

  /**
   * fetchAccounts fetch the name list in the storage.
   */
  async fetchAccounts(): Promise<string[]> {
    const res = await this.storage.get(ACCOUNTS_KEY);
    console.log(res);
    if (res) {
      return res;
    } else {
      return [];
    }
  }

  /**
   * saveAccounts store the given account list to the storage.
   *
   * @param accounts
   */
  async saveAccounts(accounts: Account[]): Promise<any> {
    const exists = await this.fetchAccounts();
    accounts.forEach(item => {
      if (exists.indexOf(item.name) < 0) {
        exists.push(item.name);
      }
      this.storage.set(item.name, item);
    });
    return await this.storage.set(ACCOUNTS_KEY, exists);
  }

  async getAccountFromLocal(name: string): Promise<Account> {
    return await this.storage.get(name) || null;
  }

  /**
   * getAccountFromEos get the account info from the eos network.
   *
   * @param name
   * @return rpc response account info.
   * Example:
   {
      'account_name': 'testacc',
      'head_block_num': 1079,
      'head_block_time': '2018-11-10T00:45:53.500',
      'privileged': false,
      'last_code_update': '1970-01-01T00:00:00.000',
      'created': '2018-11-10T00:37:05.000',
      'ram_quota': -1,
      'net_weight': -1,
      'cpu_weight': -1,
      'net_limit': {'used': -1, 'available': -1, 'max': -1},
      'cpu_limit': {'used': -1, 'available': -1, 'max': -1},
      'ram_usage': 2724,
      'permissions':
        [{'perm_name': 'active', 'parent': 'owner', 'required_auth':{
          "threshold": 1,
          "keys": [
              {
                  "key": "EOS8DDP9ZYwBJW5CHKhVhzPqJ3eiPeLHKwwyTJQxWUtN5AG3a8hPV",
                  "weight": 1
              }
          ],
          "accounts": [],
          "waits": []
        }},
      {'perm_name': 'owner', 'parent': '', 'required_auth': []}],
      'total_resources': null,
      'self_delegated_bandwidth': null,
      'refund_request': null,
      'voter_info': null
     };
   */

}
