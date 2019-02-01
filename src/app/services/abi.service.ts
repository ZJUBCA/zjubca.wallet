import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {EosService} from './eos.service';
import {ABI_KEY_PREFIX} from '../common/config';
import {TextDecoder, TextEncoder} from 'text-encoding';
import {Abi} from '../../classes';

@Injectable({
  providedIn: 'root'
})
export class AbiService {

  constructor(
    private storage: Storage,
    private eosService: EosService,
  ) {
  }

  async getAbis(contracts: string[]) {
    const abis = {};

    await Promise.all(contracts.map(async contract => {
      const cachedAbi = await this.storage.get(ABI_KEY_PREFIX + contract);
      // @ts-ignore
      // if cache expires
      if (!cachedAbi || cachedAbi.timestamp < +new Date((await this.eosService.getAccount(contract)).last_code_update)) {
        const abi = await this.eosService.getAbi(contract);
        console.log(abi);
        if (!abi) {
          return null;
        }
        // @ts-ignore
        abi.timestamp = +new Date();
        abis[contract] = abi;
        await this.storage.set(ABI_KEY_PREFIX + contract, abi);
      } else {
        abis[contract] = cachedAbi;
      }
    }));

    return abis;
  }

  /**
   * deserializeData deserialize action data from form 'hex' to readable json data.
   *
   * @param data
   * @param abi
   * @param type
   */
  deserializeData(data: string | Uint8Array | number[], abi: Abi, type: string) {
    const ser = window.eosjs_serialize;
    if (typeof data === 'string') {
      data = ser.hexToUint8Array(data);
    }
    const buffer = new ser.SerialBuffer({textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});
    buffer.pushArray(data);
    const transactionTypes = ser.getTypesFromAbi(ser.createInitialTypes(), abi);
    return transactionTypes.get(type).deserialize(buffer);
  }
}
