import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs-rn';
import { TextDecoder, TextEncoder } from 'text-encoding';
// import * as Eos from 'eosjs';


// class EosService {
//   account = {
//     'msg': 'succeeded',
//     'keys': {
//       'active_key': {
//         'public': 'EOS6Rd9FXo373NUXSpXvkA16mEeJvuJ64AekrGzVtGQLcegK6EjCm',
//         'private': '5JCfVMhq62LR8iRsRALTHnZ98EuhpQ9wX4YJzTjzzPDxBbiBSPN'
//       },
//       'owner_key': {
//         'public': 'EOS5EDRwpKuwRScjRHyRjAdAbNjuxisrJgv9GyxmCdeTqikUdfaLC',
//         'private': '5JLcjL96DDKU3wu5sh4qF7TYAEVbgRe3CMfe3ddLJhDMtzJLZgW'
//       }
//     },
//     'account': 'zjuwalletapp'
//   }
//   eos = Eos({
//     chainId: null,
//     httpEndpoint: 'https://api.kylin-testnet.eospacex.com',
//     keyProvider: this.account.keys.active_key.private,
//   })
//   async getBalance() {
//     return await this.eos.getCurrencyBalance('zjubcatokent', 'zjuwalletapp', 'SYS');
//   }
// }


class EosService {
  rpc = new JsonRpc('https://api.kylin-testnet.eospacex.com', { fetch });
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
  }
  signatureProvider = new JsSignatureProvider([this.account.keys.active_key.private]);
  api = new Api({
    rpc: this.rpc,
    signatureProvider: this.signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });
  async getBalance() {
    const result = await this.rpc.get_currency_balance('zjubcatokent', 'zjuwalletapp');
    console.log(result);
    return result;
    //[ '99999999.9999 SYS' ]
  }
}

export const eosService = new EosService()
