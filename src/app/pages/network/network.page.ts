import {Component, OnInit} from '@angular/core';
import {endpoints} from '../../common/config';
import {NetworkService} from '../../services/network.service';

interface Peer {
  name: string;
  endpoint: string;
  delay?: string;
}

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  normalPeers: Peer[];
  actionsPeers: Peer[];

  currPeer: Peer = {
    endpoint: '',
    name: '',
  };

  constructor(
    private networkSvc: NetworkService
  ) {
  }

  async ngOnInit() {
    this.normalPeers = endpoints.normal;
    this.actionsPeers = endpoints.actions;
    this.currPeer = await this.networkSvc.getNetwork();

    const peers = await Promise.all([
      await this.getDelay(this.normalPeers),
      await this.getDelay(this.actionsPeers)
    ]);
    this.normalPeers = peers[0];
    this.actionsPeers = peers[1];
  }

  async peerChange(ev) {
    const name = ev.detail.value;
    let currPeer = this.normalPeers.find(item => item.name === name);
    if (!currPeer) {
      currPeer = this.actionsPeers.find(item => item.name === name);
    }
    try {
      await this.networkSvc.setNetwork(currPeer);
      this.currPeer = currPeer;
    } catch (e) {
      console.log(e);
    }
  }

  async getDelay(peers: Peer[]): Promise<Peer[]> {
    return await Promise.all(peers.map(async peer => {
      let delay = '';
      try {
        delay = (await this.networkSvc.ping(peer.endpoint)) + ' ms';
      } catch (e) {
        delay = '超时';
      }
      return Object.assign(peer, {delay});
    }));
  }

}
