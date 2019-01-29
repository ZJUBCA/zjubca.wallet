import {Component, OnInit} from '@angular/core';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';
import {ModalController} from '@ionic/angular';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';
import axios from '../../common/axios';
import {tokenCode, tokensUrl} from '../../common/config';
import {ActivatedRoute} from '@angular/router';

class TransferForm {
  account: string;
  value: string;
  symbol = 'EOS';
  memo: string;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {

  form: TransferForm;
  symbols: string[] = ['EOS'];

  constructor(
    private eosService: EosService,
    private accService: AccountService,
    private route: ActivatedRoute,
    private modalController: ModalController,
  ) {
  }

  async ngOnInit() {
    this.form = new TransferForm();

    this.symbols = this.symbols.concat(await this.fetchSymbols());
    // @ts-ignore
    const {symbol, to} = this.route.queryParams.value;
    setTimeout(() => {
      this.form.symbol = symbol || 'EOS';
      this.form.account = to || '';
    });
  }

  async fetchSymbols(): Promise<string[]> {
    try {
      const result = await axios.get(tokensUrl);
      const tokens = result.data;
      return tokens.map(item => item.symbol);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async transfer() {
    // this.eosService.init(name, '123', ['active']);
    const code = this.filterCode(this.form.symbol);
    const asset = `${this.form.value} ${this.form.symbol}`;
    const modal = await this.modalController.create({
      component: TransactModalComponent,
      cssClass: 'transactModal',
      componentProps: {
        code,
        asset,
        to: this.form.account,
        memo: this.form.memo
      },
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
    console.log(this.form);

  }

  /**
   * filterCode filters and returns the target contract code with the given symbol type.
   *
   * @param symbol
   */
  filterCode(symbol: string): string {
    switch (symbol) {
      case 'EOS':
        return 'eosio.token';
      default:
        return tokenCode;
    }
  }

  valueBlur() {
    this.form.value = this.beautifyValue(this.form.value);
  }

  beautifyValue(value: string): string {
    const regex = /\d*\.?\d{0,4}/;
    const matches = value.match(regex);
    if (matches.length === 0) {
      return '0.0000';
    }
    value = matches[0];
    const dotInd = value.indexOf('.');
    if (dotInd < 0) {
      value += '.0000';
    } else if (dotInd < value.length - 1) {
      let remainingZeros = 4 - (value.length - dotInd - 1);
      while (remainingZeros > 0) {
        value += '0';
        remainingZeros--;
      }
      if (dotInd === 0) {
        value += '0' + value;
      }
    } else {
      value += '0000';
    }

    return value;
  }
}
