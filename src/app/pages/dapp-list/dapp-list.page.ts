import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Dapp} from '../../../classes';
import {Storage} from '@ionic/storage';
import {TEMP_DAPP_KEY} from '../../common/config';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-dapp-list',
  templateUrl: './dapp-list.page.html',
  styleUrls: ['./dapp-list.page.scss'],
})
export class DappListPage implements OnInit {

  group: string;
  dapps: Dapp[];

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private navCtrl: NavController
  ) {
  }

  async ngOnInit() {
    // @ts-ignore
    this.group = this.route.params.value.group;
    const dapps = await this.storage.get(TEMP_DAPP_KEY);
    this.dapps = dapps[this.group];
  }

  async goNav(url: string, name: string) {
    await this.navCtrl.navigateForward('dapp/' + encodeURIComponent(url) + `?name=${name}`);
  }

}
