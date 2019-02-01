export const tokensUrl = 'https://raw.githubusercontent.com/Blockchain-zju/wallet-config/master/tokens.json';

// account of token contract
export const tokenCode = 'zjubcatokent';

// kylin testnet chain id
export const CHAINID = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191';

export const endpoints = [
  {
    name: 'EOSLaomao',
    endpoint: 'https://api-kylin.eoslaomao.com'
  },
  {
    name: 'MEET.ONE',
    endpoint: 'http://kylin.meet.one:8888',
  },
  {
    name: 'EOS Asia',
    endpoint: 'https://api-kylin.eosasia.one'
  }

];

export const timezone = 'Asia/Shanghai';


/* ===== storage key ===== */
export const ENDPOINT_KEY = 'endpoint';
export const CURRENT_ACC_KEY = 'current';
export const PUBKEYS_KEY = 'pubkeys';
export const ACCOUNTS_KEY = 'accounts';
export const ABI_KEY_PREFIX = 'abi.';

/* ===== Mobile Native App Interaction QR Protocol ===== */
export const QR_PROTOCOL = 'SimpleWallet';
export const QR_VERSION = '1.0';
