import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {EosService} from '../../services/eos.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {PopoverController, ToastController} from '@ionic/angular';
import {HomePopMenuComponent} from '../../components/home-pop-menu/home-pop-menu.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {
  balance = {
    eos: 'loading...',
    zjubca: 'loading...',
  };

  currAccount: string;
  accounts: string[];
  loading = false;

  popover: any;

  constructor(
    private accountSvc: AccountService,
    private eosService: EosService,
    private storage: Storage,
    private router: Router,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController
  ) {
  }

  async ngOnInit() {
    this.loading = true;
    try {
      this.accounts = await this.accountSvc.fetchAccounts();
      this.currAccount = await this.accountSvc.current();
      if (!this.currAccount) {
        return await this.router.navigate(['/login'], {replaceUrl: true});
      }
      this.balance = await this.eosService.getBalance(this.currAccount);
      console.log(this.currAccount, this.accounts);
    } catch (e) {
      console.log(e);
      await this.alert(e.message);
    } finally {
      this.loading = false;
    }
  }

  async showMenu(ev) {
    this.popover = await this.popoverCtrl.create({
      component: HomePopMenuComponent,
      event: ev,
      translucent: true,
    });
    return await this.popover.present();
  }

  async nameChange() {
    try {
      this.loading = true;
      await this.accountSvc.setCurrent(this.currAccount);
      this.balance = await this.eosService.getBalance(this.currAccount);
    } catch (e) {
      console.log(e);
      await this.alert(e.message);
    } finally {
      this.loading = false;
    }
  }

  async alert(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000,
      cssClass: 'shortToast',
      color: 'dark'
    });
    await toast.present();
  }
}
