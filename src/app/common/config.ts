export const tokensUrl = 'https://raw.githubusercontent.com/Blockchain-zju/wallet-config/master/tokens.json';

// account of token contract
export const tokenCode = 'zjubcatokent';

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

/* ===== QR Code Configuration ===== */
export const QR_PROTOCOL = 'SimpleWallet';
export const QR_VERSION = '1.0'
