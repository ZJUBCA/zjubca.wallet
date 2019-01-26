import {Injectable} from '@angular/core';
import {WalletService} from './wallet.service';
import {AccountService} from './account.service';
import {Action} from '../../classes';

declare global {
  interface Window {
    eosjs_jsonrpc: any;
    eosjs_jssig: any;
    eosjs_api: any;
    eosjs_ecc: any;
  }
}

interface SimpleAccount {
  name: string;
  permissions: [{
    perm_name: string;
    keys: [{
      key: string;
      threshold: number;
    }]
  }];
}

@Injectable({
  providedIn: 'root'
})
export class EosService {
  constructor(
    private walletService: WalletService,
    private accountService: AccountService
  ) {
  }

  // rpc = new JsonRpc('https://api.kylin-testnet.eospacex.com', { fetch })

  // EOS response account structure
  // account = {
  //   'account_name': 'testacc',
  //   'head_block_num': 1079,
  //   'head_block_time': '2018-11-10T00:45:53.500',
  //   'privileged': false,
  //   'last_code_update': '1970-01-01T00:00:00.000',
  //   'created': '2018-11-10T00:37:05.000',
  //   'ram_quota': -1,
  //   'net_weight': -1,
  //   'cpu_weight': -1,
  //   'net_limit': {'used': -1, 'available': -1, 'max': -1},
  //   'cpu_limit': {'used': -1, 'available': -1, 'max': -1},
  //   'ram_usage': 2724,
  //   'permissions':
  //     [{'perm_name': 'active', 'parent': 'owner', 'required_auth': []},
  //       {'perm_name': 'owner', 'parent': '', 'required_auth': []}],
  //   'total_resources': null,
  //   'self_delegated_bandwidth': null,
  //   'refund_request': null,
  //   'voter_info': null
  // };
  signatureProvider: any;
  api: any;

  rpc = new window.eosjs_jsonrpc.default('https://api-kylin.eosasia.one');

  /**
   * initialize the signature provider with a fresh key corresponding the authorization.
   *
   * @param name
   * @param password
   * @param auths
   */
  async init(name: string, password: string, auths: string[]) {
    const accInfo = await this.getAccount(await this.accountService.current());

    // find the private key corresponding to the given list of authorization.
    let privKey: string;
    for (const auth of auths) {
      const perm = accInfo.permissions.find(item => item.perm_name === auth);
      const pubkeys = perm.keys.map(item => item.key);
      privKey = await this.walletService.getPrivKeyByPubKeys(pubkeys, password);
      if (privKey) {
        break;
      }
    }

    this.signatureProvider = new window.eosjs_jssig.default([privKey]);
    this.api = new window.eosjs_api.default({
      rpc: this.rpc,
      signatureProvider: this.signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
  }

  async getBalance(name: string) {
    const eosBalance = await this.rpc.get_currency_balance('eosio.token', name, 'EOS');
    const zjubcaBalance = await this.rpc.get_currency_balance('zjubcatokent', name, 'ZJUBCA');
    console.log(zjubcaBalance);
    return {
      eos: eosBalance[0] || '0 EOS',
      zjubca: zjubcaBalance[0] || '0 ZJUBCA',
    };
    // [ '99999999.9999 SYS' ]
  }

  async getTokens(name: string) {
    return await this.rpc.get_currency_balance('zjubcatokent', name);
  }

  async getAccountList(pubkey: string) {
    return await this.rpc.history_get_key_accounts(pubkey);
  }

  async getAccount(name: string) {
    return await this.rpc.get_account(name);
  }

  async sendTx(actions: Action[]) {
    const result = await this.api.transact({
      actions
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    });
    console.log(result);
  }

}
