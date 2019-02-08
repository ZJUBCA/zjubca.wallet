import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {EosService} from '../../services/eos.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {NavController, PopoverController, ToastController} from '@ionic/angular';
import {HomePopMenuComponent} from '../../components/home-pop-menu/home-pop-menu.component';
import {Resource} from '../../../classes';
import {c} from 'tar';

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
  loading = false;
  balance = {
    eos: '',
    zjubca: '',
  };

  currAccount: string;
  accounts: string[];

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
    private route: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
  }

  async ngOnInit() {
    try {
      // console.log(this.currAccount, this.accounts);
      this.loading = true;
      await this.fetchAccounts();
    } catch (e) {
      console.log(e);
      await this.alert(e.message);
    } finally {
      this.loading = false;
    }
    // listen for the url change
    this.router.events.subscribe(async (ev) => {
      // @ts-ignore
      const {url} = ev;
      if (ev instanceof NavigationEnd) {
        // console.log(url);
        if (url && url.indexOf('tabs/assets') >= 0) {
          if (url.indexOf('refresh') >= 0) {
            const params = url.split('?');
            const pairs = params[1].split('=');
            if (pairs[1] === '1') {
              // @ts-ignore
              try {
                this.loading = true;
                await this.fetchDetails();
              } catch (e) {
                await this.alert(e.message);
              } finally {
                this.loading = false;
              }
            }
          } else {
            await this.fetchAccounts();
          }
        }
      }
    });
  }

  /**
   * fetchAccounts fetches account list. If current account is changed, it will invoke fetching balance and resource.
   */
  async fetchAccounts() {
    this.accounts = []; // necessary for view refreshing.
    this.accounts = await this.accountSvc.fetchAccounts();
    const curr = await this.accountSvc.current();
    const oldCurr = this.currAccount;
    this.currAccount = curr;
    if (!curr) {
      return await this.navCtrl.navigateRoot('/login', {replaceUrl: true});
    }
    if (curr !== oldCurr) {
      await this.fetchDetails();
    }
  }

  /**
   * fetchDetails fetches account balance and resource.
   */
  async fetchDetails() {
    await Promise.all([
      this.fetchBalance(this.currAccount),
      this.fetchResource(this.currAccount)
    ]);
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
      await this.fetchDetails();
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
