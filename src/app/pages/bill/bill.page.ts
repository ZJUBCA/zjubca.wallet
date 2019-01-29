import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {ActivatedRoute} from '@angular/router';
import {QRData} from '../../../classes';
import {QR_PROTOCOL, QR_VERSION, tokenCode} from '../../common/config';

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
    // @ts-ignore
    this.symbol = this.route.queryParams.value.symbol || 'EOS';
    this.account = await this.accService.current();

    const qrData: QRData = {
      protocol: QR_PROTOCOL,
      version: QR_VERSION,
      action: 'transfer',
      to: this.account,
      amount: 0,
      contract: tokenCode,
      symbol: this.symbol,
      precision: 4
    };
    this.qrcode = JSON.stringify(qrData);
  }

}
