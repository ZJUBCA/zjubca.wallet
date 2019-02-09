// @ts-ignore
import {version} from '../../../package.json';

export const tokensUrl = 'https://raw.githubusercontent.com/Blockchain-zju/wallet-config/master/tokens.json';
export const dappsUrl = 'https://raw.githubusercontent.com/Blockchain-zju/wallet-config/master/dapps.json';

// account of token contract
export const tokenCode = 'zjubcatokent';

// kylin testnet chain id
export const CHAINID = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191';

export const endpoints = {
  'normal': [
    {
      name: 'MEET.ONE',
      endpoint: 'http://kylin.meet.one:8888',
    },
    {
      name: 'EOSpacex',
      endpoint: 'https://api.kylin-testnet.eospacex.com'
    },
    {
      name: 'EOSbixin',
      endpoint: 'http://kylin.fn.eosbixin.com'
    },
    {
      name: 'Alohaeos',
      endpoint: 'https://api.kylin.alohaeos.com'
    },
    {
      name: 'EOScanada',
      endpoint: 'https://kylin.eoscanada.com'
    },
    {
      name: 'EOSbeijing',
      endpoint: 'http://api.kylin.eosbeijing.one:8880'
    },
    {
      name: 'StartEOS',
      endpoint: 'http://api-kylin.starteos.io'
    }
  ],
  // support `get_action`
  'actions': [
    {
      name: 'EOSLaomao',
      endpoint: 'https://api-kylin.eoslaomao.com'
    },
    {
      name: 'EOS Asia',
      endpoint: 'https://api-kylin.eosasia.one'
    }
  ]
};

// export const timezone = 'Asia/Shanghai';
export const timezone = 960;


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
