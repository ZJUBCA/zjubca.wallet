import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import Cryptojs from 'crypto-js';
import {Wallet} from '../../classes';
import {PUBKEYS_KEY} from '../common/config';
import {AccountService} from './account.service';

const SELF_WALLET = 'self_wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  static whitelist = {};
  ase = Cryptojs.AES;

  constructor(
    private storage: Storage,
    private accService: AccountService
  ) {
  }


  async saveWallet(name: string, pubKey: string, privKey: string, password: string): Promise<any> {
    const encrypted = this.ase.encrypt(privKey, password).toString();
    // console.log(pubKey, encrypted);
    const exist = await this.getWallet(pubKey);
    if (exist) {
      return;
    }
    const wallet: Wallet = {
      name,
      publicKey: pubKey,
      encrypted_privkey: encrypted
    };
    await this.storage.set(pubKey, wallet);

    return await this.pushKey(pubKey);
  }

  /**
   * retrieveKey returns the decrypted private key corresponding to the given public key.
   *
   * @param pubKey
   * @param password
   * @param origin
   * @param whitelist
   */
  async retrieveKey(pubKey: string, password: string, origin: string = SELF_WALLET, whitelist: boolean = false): Promise<string> {
    const wallet: Wallet = await this.getWallet(pubKey);
    if (wallet) {
      const privKey = this.ase.decrypt(wallet.encrypted_privkey, password).toString(Cryptojs.enc.Utf8);
      if (whitelist && privKey) {
        WalletService.whitelist[origin + pubKey] = privKey;
      }
      return privKey;
    } else {
      return '';
    }
  }

  /**
   * pushKey push a new public key to the key list.
   */
  async pushKey(pubKey: string) {
    const keys = await this.storage.get(PUBKEYS_KEY) || [];
    console.log(keys);
    if (keys.indexOf(pubKey) < 0) {
      keys.push(pubKey);
      await this.storage.set(PUBKEYS_KEY, keys);
    }
  }

  /**
   * getWallet returns the key pair with the given public key.
   *
   * @param pubKey
   */
  async getWallet(pubKey: string): Promise<Wallet> {
    return await this.storage.get(pubKey);
  }

  /**
   * getPublicKeys returns all public keys in local storage.
   */
  async getPublicKeys(): Promise<string[]> {
    return await this.storage.get(PUBKEYS_KEY) || [];
  }

  /**
   * removeWallet removes a key pair from local storage.
   *
   * @param pubKey
   */
  async removeWallet(pubKey: string) {
    const pubkeys = await this.getPublicKeys();
    const index = pubkeys.indexOf(pubKey);
    if (index >= 0) {
      pubkeys.splice(index, 1);
    }
    await this.storage.set(PUBKEYS_KEY, pubkeys);

    let names = await this.accService.fetchAccounts();
    const amount = names.length;
    names = await Promise.all(names.map(async name => {
      if (await this.accService.removeAccount(name, pubKey)) {
        return null;
      } else {
        return name;
      }
    }));
    names = names.filter(x => x !== null);
    if (names.length !== amount) {
      await this.accService.setAccounts(names);
    }
    const curr = await this.accService.current();
    if (names.indexOf(curr) < 0) {
      // if current account has been removed
      await this.accService.setCurrent(names[0]);
    }
    await this.storage.remove(pubKey);
  }

  // async getPublicKey(name: string, permission: string): string {
  //   const pubkeys = await this.getPublicKeys();
  // }

  getFromWhitelist(publicKey: string, origin: string = SELF_WALLET): string {
    return WalletService.whitelist[origin + publicKey];
  }

  isInWhitelist(origin: string, publicKey: string): boolean {
    return typeof WalletService.whitelist[origin + publicKey] !== undefined;
  }

  rmFromWhitelist(origin: string, publicKey: string) {
    delete WalletService.whitelist[origin + publicKey];
  }
}
