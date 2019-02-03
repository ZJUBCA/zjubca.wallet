export interface Account {
  name: string;
  permissions: Permission[];
}

export interface Permission {
  publicKey: string;
  permission: string;
}

export interface Wallet {
  name: string; // wallet name, not account name
  publicKey: string;
  encrypted_privkey: string;
}

export interface Action {
  account: string;  // contract account
  name: string;     // action name
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: any;
}

export interface Token {
  logo: string;
  symbol: string;
  value: string;
  account: string;
  intro: string;
}

export interface Abi {
  version: string;
  types: Array<{ new_type_name: string, type: string }>;
  structs: Array<{ name: string, base: string, fields: Array<{ name: string, type: string }> }>;
  actions: Array<{ name: string, type: string, ricardian_contract: string }>;
  tables: Array<{ name: string, type: string, index_type: string, key_names: string[], key_types: string[] }>;
  ricardian_clauses: Array<{ id: string, body: string }>;
  error_messages: Array<{ error_code: string, error_msg: string }>;
  abi_extensions: Array<{ tag: number, value: string }>;
  variants?: Array<{ name: string, types: string[] }>;
}

// Data structure for QR transaction, based on the `SimpleWallet` protocol
// url: https://github.com/southex/SimpleWallet#3-%E6%94%AF%E4%BB%98
export interface QRData {
  protocol: string;    // 协议名，钱包用来区分不同协议，本协议为 SimpleWallet
  version: string;     // 协议版本信息，如1.0
  dappName?: string;   // dapp名字，用于在钱包APP中展示，可选
  dappIcon?: string;   // dapp图标Url，用于在钱包APP中展示，可选
  action: string;      // 支付时，赋值为transfer，必须
  from?: string;       // 付款人的EOS账号，可选
  to: string;          // 收款人的EOS账号，必须
  amount: number;      // 转账数量，必须
  contract: string;    // 转账的token所属的contract账号名，必须
  symbol: string;      // 转账的token名称，必须
  precision: number;   // 转账的token的精度，小数点后面的位数，必须
  dappData?: string;   // 由dapp生成的业务参数信息，需要钱包在转账时附加在memo中发出去，格式为:k1=v1&k2=v2，可选
                       // 钱包转账时还可附加ref参数标明来源，如：k1=v1&k2=v2&ref=walletname
  desc?: string;       // 交易的说明信息，钱包在付款UI展示给用户，最长不要超过128个字节，可选
  expired?: number;    // 二维码过期时间，unix时间戳
  callback?: string;   // 用户完成操作后，钱包回调拉起dapp移动端的回调URL,如https://abc.com?action=login&qrcID=123，可选
                       // 钱包回调时在此URL后加上操作结果(result、txID)，如：https://abc.com?action=login&qrcID=123&result=1&txID=xxx,
                       // result的值为：0为用户取消，1为成功,  2为失败；txID为EOS主网上该笔交易的id（若有）
}
