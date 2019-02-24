import {Component, OnInit} from '@angular/core';
import axios from '../../common/axios';
import {NavController, ToastController} from '@ionic/angular';
import {dappsUrl, TEMP_DAPP_KEY} from '../../common/config';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-dapp',
  templateUrl: './dapp.page.html',
  styleUrls: ['./dapp.page.scss'],
})
export class DappPage implements OnInit {

  groups: string[];
  dapps: any;
  showAmount = 5; // amount of showing dapps in each group
  loading = false;

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private storage: Storage
  ) {
  }

  ngOnInit() {
    this.fetchDapps();
  }

  async fetchDapps() {
    try {
      this.loading = true;
      const res = await axios.get(dappsUrl);
      if (res.data) {
        this.groups = Object.keys(res.data);
        this.dapps = res.data;
        await this.storage.set(TEMP_DAPP_KEY, this.dapps);
      }
    } catch (e) {
      console.log(e);
      await this.alert(e.message);
    } finally {
      this.loading = false;
    }
  }

  async goDappNav(url: string) {
    await this.navCtrl.navigateForward('dapp/' + encodeURIComponent(url));
  }

  async goNav(url: string) {
    await this.navCtrl.navigateForward(url);
  }

  async alert(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000,
      cssClass: 'showToast',
      color: 'dark'
    });
    await toast.present();
  }

}
