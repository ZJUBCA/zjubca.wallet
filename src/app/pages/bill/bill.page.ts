import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/account.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {

  qrcodeString: string = null;

  constructor(
    private accService: AccountService
  ) {
  }

  async ngOnInit() {
    this.qrcodeString = await this.accService.current();
  }

}
