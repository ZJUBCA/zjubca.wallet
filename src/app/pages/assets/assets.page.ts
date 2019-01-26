import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/account.service';
import {Index} from '../../../classes';
import {EosService} from '../../core/eos.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {

  constructor(
    private accountSvc: AccountService,
    public eosService: EosService
  ) {
  }

  get account() {
    console.log(this.accountSvc.accounts);
    return this.accountSvc.accounts;
  }

  async ngOnInit() {
    this.balance = await this.eosService.getBalance();
    this.accountSvc.fetchAccounts();
  }

  balance: string;
}
