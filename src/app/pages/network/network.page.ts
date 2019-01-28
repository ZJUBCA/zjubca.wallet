import {Component, OnInit} from '@angular/core';
import {ENDPOINT_KEY, endpoints} from '../../common/config';
import {Storage} from '@ionic/storage';

interface Peer {
  name: string;
  endpoint: string;
}

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  peers: Peer[];

  currPeer: Peer = {
    endpoint: '',
    name: ''
  };

  constructor(
    private storage: Storage
  ) {
  }

  async ngOnInit() {
    this.peers = endpoints;
    const currPeer = await this.storage.get(ENDPOINT_KEY);
    if (currPeer) {
      this.currPeer = JSON.parse(currPeer);
    }
  }

  async peerChange(ev) {
    const name = ev.detail.value;
    this.currPeer = this.peers.find(item => item.name === name);
    await this.storage.set(ENDPOINT_KEY, JSON.stringify(this.currPeer));
  }

}
