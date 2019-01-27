import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/account.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {

  account: string;
  symbol: string;
  qrcode: string = null;

  constructor(
    private accService: AccountService,
    private route: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    this.symbol = this.route.queryParams.value.symbol || 'EOS';
    this.account = await this.accService.current();

    this.qrcode = JSON.stringify({
      symbol: this.symbol,
      account: this.account,
      type: 'transfer'
    });
  }

}
