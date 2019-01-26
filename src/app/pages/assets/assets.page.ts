import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../core/account.service';
import {Account} from '../../../classes/account';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {

  constructor(
    private accountSvc: AccountService,
  ) { }
  
  get account() {
    console.log(this.accountSvc.accounts);
    return this.accountSvc.accounts;
  }

  ngOnInit() {}

}
