// @ts-ignore
import {version} from '../../../package.json';

export const tokensUrl = 'https://raw.githubusercontent.com/Blockchain-zju/wallet-config/master/tokens.json';
export const dappsUrl = 'https://raw.githubusercontent.com/Blockchain-zju/wallet-config/master/dapps.json';

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
    endpoint: 'https://api-kylin.meet.one',
  },
  {
    name: 'EOS Asia',
    endpoint: 'https://api-kylin.eosasia.one'
  }

];

export const timezone = 'Asia/Shanghai';


/* ===== storage key ===== */
export const ENDPOINT_KEY = 'ENDPOINT';
export const CURRENT_ACC_KEY = 'CURRENT';
export const PUBKEYS_KEY = 'PUBKEYS';
export const ACCOUNTS_KEY = 'ACCOUNTS';
export const ABI_KEY_PREFIX = 'ABI.';
export const TEMP_DAPP_KEY = 'DAPPS';

/* ===== Mobile Native App Interaction QR Protocol ===== */
export const QR_PROTOCOL = 'SimpleWallet';
export const QR_VERSION = '1.0';

/* ===== Wallet Meta ===== */
export const VERSION = version;
