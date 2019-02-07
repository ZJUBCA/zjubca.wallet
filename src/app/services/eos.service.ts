import {Injectable} from '@angular/core';
import {WalletService} from './wallet.service';
import {Abi, Action, Resource} from '../../classes';
import {TextDecoder, TextEncoder} from 'text-encoding';
import {tokenCode} from '../common/config';
import {NetworkService} from './network.service';
import {Buffer} from 'buffer';


declare global {
  interface Window {
    eosjs_jsonrpc: any;
    eosjs_jssig: any;
    eosjs_api: any;
    eosjs_ecc: any;
    eosjs_serialize: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EosService {
  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
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
  rpc: any;

  async RPC() {
    const currPeer = await this.networkService.getNetwork();
    return new window.eosjs_jsonrpc.default(currPeer.endpoint);
  }

  /**
   * initialize the signature provider with a fresh key corresponding the authorization.
   *
   * @param name
   * @param password
   * @param auths
   */
  async init(name: string, password: string, auths: string[]) {
    const accInfo = await this.getAccount(name);
    console.log(accInfo);

    // find the private key corresponding to the given list of authorization.
    let privKey: string;
    for (const auth of auths) {
      const perm = accInfo.permissions.find(item => item.perm_name === auth);
      const pubkeys = perm.required_auth.keys.map(item => item.key);
      for (const pubkey of pubkeys) {
        privKey = await this.walletService.retrieveKey(pubkey, password);
        if (privKey) {
          break;
        }
      }
      if (privKey) {
        break;
      }
    }

    if (!privKey) {
      throw new Error('密码不正确或无可用密钥');
    }

    // console.log(privKey);
    const rpc = await this.RPC();
    this.signatureProvider = new window.eosjs_jssig.default([privKey]);
    this.api = new window.eosjs_api.default({
      rpc: rpc,
      signatureProvider: this.signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
  }

  async getInfo() {
    const rpc = await this.RPC();
    return await rpc.get_info();
  }

  /**
   * getBalance fetches the balance of eos and zjubca of the given account name.
   *
   * @param name
   */
  async getBalance(name: string) {
    const rpc = await this.RPC();
    const eosBalance = await rpc.get_currency_balance('eosio.token', name, 'EOS');
    const zjubcaBalance = await rpc.get_currency_balance(tokenCode, name, 'ZJUBCA');
    console.log(zjubcaBalance);
    return {
      eos: (eosBalance[0] || '0 EOS').split(' ')[0],
      zjubca: (zjubcaBalance[0] || '0 ZJUBCA').split(' ')[0],
    };
    // [ '99999999.9999 SYS' ]
  }

  /**
   * getTokensBalance fetches and returns all tokens with its balance of the given name from code.
   *
   * @param name
   * @param code
   * @param symbol
   */
  async getTokenBalance(code: string, name: string, symbol?: string) {
    const rpc = await this.RPC();
    return await rpc.get_currency_balance(code, name, symbol);
  }

  /**
   * getAccountList fetches and returns all the accounts controlled by the given public key.
   *
   * @param pubkey
   */
  async getAccountList(pubkey: string): Promise<any> {
    const rpc = await this.RPC();
    return await rpc.history_get_key_accounts(pubkey);
  }

  /**
   * getAccount fetches and returns the detail account info of the given account name.
   *
   * @param name
   */
  async getAccount(name: string): Promise<any> {
    const rpc = await this.RPC();
    return await rpc.get_account(name);
  }

  async sendTransaction(actions: Action[], broadcast: boolean = true): Promise<any> {
    return await this.api.transact({
      actions
    }, {
      broadcast,
      blocksBehind: 3,
      expireSeconds: 30
    });
  }

  async getResource(name: string): Promise<Resource> {
    const info = await this.getAccount(name);
    const resrc: Resource = {
      ram: {
        max: info.ram_quota,
        used: info.ram_usage
      },
      cpu: {
        max: info.cpu_limit.max,
        used: info.cpu_limit.used
      },
      net: {
        max: info.net_limit.max,
        used: info.net_limit.used
      },
    };
    return resrc;
  }

  /**
   * getActions fetches and returns the history actions of the given account name.
   *
   * @param name
   */
  async getActions(name: string, pos: number, offset: number): Promise<any> {
    const rpc = await this.RPC();
    return await rpc.history_get_actions(name, pos, offset);
  }

  async getBlock() {
    const rpc = await this.RPC();
    return await rpc.get_block();
  }

  async getAbi(name: string): Promise<Abi> {
    const rpc = await this.RPC();
    const result = await rpc.get_abi(name);
    return result.abi;
  }

  sign(payload: any, privKey: string, arbitrary = false, isHash = false): string {
    if (arbitrary && isHash) {
      return window.eosjs_ecc.Signature.signHash(payload.data, privKey).toString();
    }
    return window.eosjs_ecc.sign(Buffer.from(arbitrary ? payload.data : payload.buf, 'utf8'), privKey);
  }

}
