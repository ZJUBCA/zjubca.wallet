import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {EosService} from '../../services/eos.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {PopoverController, ToastController} from '@ionic/angular';
import {HomePopMenuComponent} from '../../components/home-pop-menu/home-pop-menu.component';
import {Resource} from '../../../classes';

enum resrcType {
  BYTES = 0,
  TIME
}

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

  TYPE: resrcType;

  resource: Resource = {
    ram: {
      max: 1,
      used: 0,
    },
    cpu: {
      max: 1,
      used: 0,
    },
    net: {
      max: 1,
      used: 0
    }
  };

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
      await Promise.all([
        this.fetchBalance(this.currAccount),
        this.fetchResource(this.currAccount)
      ]);
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

  async fetchBalance(name: string) {
    try {
      this.balance = await this.eosService.getBalance(name);
    } catch (e) {
      await this.alert('获取余额失败');
    }
  }

  async fetchResource(name: string) {
    try {
      this.resource = await this.eosService.getResource(name);
    } catch (e) {
      await this.alert('获取账户资源失败');
    }
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

  format(val: number, type: resrcType): string {
    const kb = 1024, mb = 1024 * 1024, ms = 1000, s = 1000 * 1000;
    let result, unit;
    if (type === resrcType.BYTES) {
      if (val >= mb) {
        result = val / mb;
        unit = ' MB';
      } else if (val >= kb) {
        result = val / kb;
        unit = ' KB';
      } else {
        result = val;
        unit = ' B';
      }
    } else if (type === resrcType.TIME) {
      if (val >= s) {
        result = val / s;
        unit = ' s';
      } else if (val >= ms) {
        result = val / ms;
        unit = ' ms';
      } else {
        result = val;
        unit = ' us';
      }
    } else {
      return '' + val;
    }

    return result.toFixed(2) + unit;
  }
}
