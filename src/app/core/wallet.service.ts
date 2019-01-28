import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import Cryptojs from 'crypto-js';
import {Wallet} from '../../classes';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private storage: Storage
  ) {
  }

  ase = Cryptojs.AES;

  async saveKey(pubKey: string, privKey: string, password: string): Promise<any> {
    const encrypted = this.ase.encrypt(privKey, password).toString();
    console.log(pubKey, encrypted);
    await this.storage.set(pubKey, JSON.stringify({
      pubKey: pubKey,
      encrypted_privkey: encrypted
    }));

    return await this.pushKey(pubKey);
  }

  async retrieveKey(pubKey: string, password: string): Promise<string> {
    const keypair = await this.storage.get(pubKey);
    if (keypair) {
      const wallet: Wallet = JSON.parse(keypair);
      return this.ase.decrypt(wallet.encrypted_privkey, password).toString(Cryptojs.enc.Utf8);
    } else {
      return '';
    }
  }

  /**
   * pushKey push a new public key to the key list
   */
  async pushKey(pubKey: string) {
    let keys = await this.storage.get('pubkeys');
    if (!keys) {
      keys = [];
    } else {
      keys = JSON.parse(keys);
    }
    if (keys.indexOf(pubKey) < 0) {
      keys.push(pubKey);
      await this.storage.set('pubkeys', keys);
    }
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
