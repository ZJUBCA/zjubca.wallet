import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import Cryptojs from 'crypto-js';
import {Wallet} from '../../classes';
import {PUBKEYS_KEY} from '../common/config';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private storage: Storage
  ) {
  }

  ase = Cryptojs.AES;

  async saveWallet(name: string, pubKey: string, privKey: string, password: string): Promise<any> {
    const encrypted = this.ase.encrypt(privKey, password).toString();
    // console.log(pubKey, encrypted);
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
   */
  async retrieveKey(pubKey: string, password: string): Promise<string> {
    const wallet: Wallet = await this.getWallet(pubKey);
    if (wallet) {
      return this.ase.decrypt(wallet.encrypted_privkey, password).toString(Cryptojs.enc.Utf8);
    } else {
      return '';
    }
  }

  /**
   * pushKey push a new public key to the key list
   */
  async pushKey(pubKey: string) {
    let keys = await this.storage.get(PUBKEYS_KEY);
    console.log(keys);
    if (!keys) {
      keys = [];
    }
    if (keys.indexOf(pubKey) < 0) {
      keys.push(pubKey);
      await this.storage.set(PUBKEYS_KEY, keys);
    }
  }

  async getWallet(pubKey: string): Promise<Wallet> {
    return await this.storage.get(pubKey);
  }

  async getWallets(): Promise<string[]> {
    return await this.storage.get(PUBKEYS_KEY);
  }

  /**
   * getPrivKeyByPubkeys will return the private key which first corresponds to the given public key.
   *
   * @param pubkeys
   * @param password
   */
  async getPrivKeyByPubKeys(pubkeys: string, password: string): Promise<string> {
    let privKey: string;
    for (const pubkey of pubkeys) {
      privKey = await this.retrieveKey(pubkey, password);
      if (privKey) {
        break;
      }
    }
    return privKey;
  }
}
