import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Wallet} from '../../../classes';
import {WalletService} from '../../services/wallet.service';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {ToastController} from '@ionic/angular';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-wallet-manage',
  templateUrl: './wallet-manage.page.html',
  styleUrls: ['./wallet-manage.page.scss'],
})
export class WalletManagePage implements OnInit {
  wallets: Wallet[] = [];

  constructor(
    private storage: Storage,
    private router: Router,
    private walletSvc: WalletService,
    private toastController: ToastController,
    private clipboard: Clipboard
  ) {
  }

  ngOnInit() {
    this.router.events
      .subscribe(e => {
        if (e instanceof NavigationEnd && e.url === '/wallet-manage') {
          this.init();
        }
      });
    this.init();
  }

  async init() {
    const keys = await this.walletSvc.getPublicKeys();
    const wallets = [];
    for (const key of keys) {
      wallets.push(await this.walletSvc.getWallet(key));
    }
    this.wallets = wallets;
  }

  async copy(pubkey) {
    try {
      await this.clipboard.copy(pubkey);
      const toast = await this.toastController.create({
        message: '已复制',
        position: 'bottom',
        duration: 1500,
        cssClass: 'shortToast',
        color: 'dark'
      });
      toast.present();
    } catch (e) {
      console.log(e);
    }
  }

}
