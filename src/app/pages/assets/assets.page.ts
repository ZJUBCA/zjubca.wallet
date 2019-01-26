import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/account.service';
import {EosService} from '../../core/eos.service';

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
    public eosService: EosService
  ) {
  }

  async ngOnInit() {
    this.accounts = await this.accountSvc.fetchAccounts();
    this.currAccount = await this.accountSvc.current();
    this.balance = await this.eosService.getBalance(this.currAccount);
    console.log(this.currAccount, this.accounts);
  }
}
