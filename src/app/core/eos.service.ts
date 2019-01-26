import {Injectable} from '@angular/core';

declare global {
  interface Window {
    eosjs_jsonrpc: any;
    eosjs_jssig: any;
    eosjs_api: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EosService {
  constructor() {
  }

  // rpc = new JsonRpc('https://api.kylin-testnet.eospacex.com', { fetch })
  account = {
    'msg': 'succeeded',
    'keys': {
      'active_key': {
        'public': 'EOS6Rd9FXo373NUXSpXvkA16mEeJvuJ64AekrGzVtGQLcegK6EjCm',
        'private': '5JCfVMhq62LR8iRsRALTHnZ98EuhpQ9wX4YJzTjzzPDxBbiBSPN'
      },
      'owner_key': {
        'public': 'EOS5EDRwpKuwRScjRHyRjAdAbNjuxisrJgv9GyxmCdeTqikUdfaLC',
        'private': '5JLcjL96DDKU3wu5sh4qF7TYAEVbgRe3CMfe3ddLJhDMtzJLZgW'
      }
    },
    'account': 'zjuwalletapp'
  };
  rpc = new window.eosjs_jsonrpc.default('http://178.62.36.41:8888');
  signatureProvider = new window.eosjs_jssig.default([this.account.keys.active_key.private]);
  api = new window.eosjs_api.default({
    rpc: this.rpc,
    signatureProvider: this.signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });

  async getBalance(name: string) {
    const eosBalance = await this.rpc.get_currency_balance('eosio.token', name, 'EOS');
    const zjubcaBalance = await this.rpc.get_currency_balance('zjubcatokent', name, 'ZJUBCA');
    console.log(zjubcaBalance);
    return {
      eos: eosBalance[0],
      zjubca: zjubcaBalance[0],
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
}
