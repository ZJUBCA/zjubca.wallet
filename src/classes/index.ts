export interface Account {
  name: string;
}

export interface Wallet {
  publicKey: string;
  encrypted_privkey: string;
}

export interface Action {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: any;
}
