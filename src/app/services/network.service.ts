import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ENDPOINT_KEY, endpoints} from '../common/config';

interface Peer {
  name: string;
  endpoint: string;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(
    private storage: Storage
  ) {
  }

  async setNetwork(peer: Peer) {
    await this.storage.set(ENDPOINT_KEY, peer);
  }

  async getNetwork(): Promise<Peer> {
    const peer = await this.storage.get(ENDPOINT_KEY);
    if (!peer) {
      await this.setNetwork(endpoints[0]);
      return endpoints[0];
    }
    return peer;
  }
}
