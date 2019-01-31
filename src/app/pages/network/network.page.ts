import {Component, OnInit} from '@angular/core';
import {endpoints} from '../../common/config';
import {NetworkService} from '../../services/network.service';

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
    private networkSvc: NetworkService
  ) {
  }

  async ngOnInit() {
    this.peers = endpoints;
    this.currPeer = await this.networkSvc.getNetwork();
  }

  async peerChange(ev) {
    const name = ev.detail.value;
    this.currPeer = this.peers.find(item => item.name === name);
    await this.networkSvc.setNetwork(this.currPeer);
  }

}
