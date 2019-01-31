export const METHOD_TYPEs = {
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

export interface Request {
  id: string;
  appKey: string;
  nonce: string | number;
  nextNonce: string | number;
  payload: any;
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
