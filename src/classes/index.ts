export interface Account {
  name: string;
  ownerKey: string;
  activeKey: string;
}

export interface Wallet {
  publicKey: string;
  encrypted_privkey: string;
}

