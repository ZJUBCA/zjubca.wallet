import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/account.service';
import {EosService} from '../../core/eos.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {
  balance = {
    eos: '0 EOS',
    zjubca: '0 ZJUBCA',
  };

  currAccount: string;
  accounts: string[];

  constructor(
    private accountSvc: AccountService,
    private eosService: EosService,
    private storage: Storage,
    private router: Router
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
}
