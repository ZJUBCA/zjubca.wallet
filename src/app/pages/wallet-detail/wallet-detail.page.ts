import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EosService} from '../../services/eos.service';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';
import {WalletService} from '../../services/wallet.service';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.page.html',
  styleUrls: ['./wallet-detail.page.scss'],
})
export class WalletDetailPage implements OnInit {

  publicKey: string;
  accounts: string[] = [];
  accountsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private eosService: EosService,
    private walletService: WalletService,
    private accService: AccountService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router,
    private navCtrl: NavController
  ) {
  }

  async ngOnInit() {
    // @ts-ignore
    this.publicKey = this.route.params.value.pubkey;
    console.log(this.publicKey);

    await this.getAccounts();
  }

  async getAccounts() {
    this.accountsLoading = true;
    try {
      const accounts = await this.eosService.getAccountList(this.publicKey);
      console.log(accounts);
      this.accounts = this.accounts.concat(accounts.account_names);
    } catch (e) {
      await this.toast(e.message);
    } finally {
      this.accountsLoading = false;
    }
  }

  async toast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
      cssClass: 'shortToast',
      color: 'dark'
    });
    await toast.present();
  }

  async exportKey() {
    const modal = await this.modalCtrl.create(
      {
        component: TransactModalComponent,
        cssClass: 'noActionTransactModal',
        componentProps: {
          sign: true,
          type: 'exportKey'
        },
        backdropDismiss: true,
        showBackdrop: true
      }
    );

    await modal.present();

    const {data} = await modal.onDidDismiss();
    if (data && data.password) {
      const privKey = await this.walletService.retrieveKey(this.publicKey, data.password);
      if (!privKey) {
        return await this.toast('密码不正确');
      }
      this.router.navigate(['/export-key/' + privKey]);
    }
  }

  async changePassword() {
    await this.toast('暂未开放');
  }

  async deleteWallet() {
    const warning = await this.alertCtrl.create({
      header: '确认',
      message: '确定要删除该钱包吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '确认',
          handler: async () => {
            await warning.present();
            await this.walletService.removeWallet(this.publicKey);
            const accounts = await this.accService.fetchAccounts();
            if (accounts.length === 0) {
              this.navCtrl.navigateRoot('/login');
            } else {
              this.navCtrl.back({animationDirection: 'back'});
            }
          }
        }
      ]
    });

    await warning.present();
  }
}
