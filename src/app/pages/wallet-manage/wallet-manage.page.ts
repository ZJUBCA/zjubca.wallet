import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {PUBKEYS_KEY} from '../../common/config';
import {Wallet} from '../../../classes';
import {WalletService} from '../../core/wallet.service';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-wallet-manage',
  templateUrl: './wallet-manage.page.html',
  styleUrls: ['./wallet-manage.page.scss'],
})
export class WalletManagePage implements OnInit {
  wallets: Wallet[] = [];

  constructor(
    private storage: Storage,
    private walletSvc: WalletService,
    private toastController: ToastController,
    private clipboard: Clipboard
  ) {
  }

  async ngOnInit() {
    const keys = await this.storage.get(PUBKEYS_KEY);
    for (const key of keys) {
      this.wallets.push(await this.walletSvc.getWallet(key));
    }
  }

  async copy(pubkey) {
    this.clipboard.copy(pubkey);
    const toast = await this.toastController.create({
      message: '已复制',
      position: 'bottom',
      duration: 1500,
      cssClass: 'shortToast',
      color: 'dark'
    });
    toast.present();
  }

}
