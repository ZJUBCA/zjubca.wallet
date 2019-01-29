import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {EosService} from '../../services/eos.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {PopoverController} from '@ionic/angular';
import {HomePopMenuComponent} from '../../components/home-pop-menu/home-pop-menu.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {
  balance = {
    eos: '获取中...',
    zjubca: '获取中...',
  };

  currAccount: string;
  accounts: string[];

  popover: any;

  constructor(
    private accountSvc: AccountService,
    private eosService: EosService,
    private storage: Storage,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {
  }

  async ngOnInit() {
    this.accounts = await this.accountSvc.fetchAccounts();
    this.currAccount = await this.accountSvc.current();
    if (!this.currAccount) {
      return await this.router.navigateByUrl('/login', {replaceUrl: true});
    }
    this.balance = await this.eosService.getBalance(this.currAccount);
    console.log(this.currAccount, this.accounts);
  }

  async showMenu(ev) {
    this.popover = await this.popoverCtrl.create({
      component: HomePopMenuComponent,
      event: ev,
      translucent: true,
    });
    return await this.popover.present();
  }

}
