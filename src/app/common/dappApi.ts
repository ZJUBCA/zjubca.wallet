export const METHOD_TYPES = {
  getVersion: 'getVersion',
  getOrRequestIdentity: 'getIdentity',
  identityFromPermissions: 'getIdentityFromPermissions',
  forgetIdentity: 'forgetIdentity',
  updateIdentity: 'updateIdentity',
  authenticate: 'authenticate',
  requestArbitrarySignature: 'getArbitrarySignature',
  getPublicKey: 'getPublicKey',
  linkAccount: 'linkAccount',
  hasAccountFor: 'hasAccountFor',
  requestAddNetwork: 'suggestNetwork',
  requestTransfer: 'requestTransfer',
  requestSignature: 'requestSignature',
  createTransaction: 'createTransaction',
  addToken: 'addToken',
};

export const READABLE_TYPES = {
  [METHOD_TYPES.getVersion]: '获取版本信息',
  [METHOD_TYPES.getOrRequestIdentity]: '登录/获取账户信息',
  [METHOD_TYPES.identityFromPermissions]: '登录/获取账户信息',
  [METHOD_TYPES.forgetIdentity]: '登出',
  [METHOD_TYPES.updateIdentity]: '更新账户信息',
  [METHOD_TYPES.authenticate]: '授权',
  [METHOD_TYPES.requestArbitrarySignature]: '请求签名',
  [METHOD_TYPES.getPublicKey]: '获取公钥',
  [METHOD_TYPES.linkAccount]: '链接账户',
  [METHOD_TYPES.requestSignature]: '获取交易签名',
  [METHOD_TYPES.requestTransfer]: '转账'
};

export interface Request {
  id: string;
  appKey: string;
  nonce: string | number;
  nextNonce: string | number;
  payload: any;
  type?: string;
}

export interface Response {
  protocol: string;
  type: string;
  data: {
    id: string;
    result: any;
  } | any;
}

export interface Account {
  authority: string;
  blockchain: string;
  chainId: string;
  isHardware: boolean;
  name: string;
  publicKey: {
    key: string;
    weight: number;
  };
}

export interface Identification {
  accounts: Account[];
  hash: string;
  kyc: boolean;
  name: string;  // network name, e.g 'EOS'.
  publicKey: string;  // key used to verify hash
}

export interface Permission {
  origin: string;
  accounts: Account[];
}
