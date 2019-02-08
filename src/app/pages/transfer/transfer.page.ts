import {Component, OnInit} from '@angular/core';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';
import {ModalController, NavController} from '@ionic/angular';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';
import axios from '../../common/axios';
import {tokenCode, tokensUrl} from '../../common/config';
import {ActivatedRoute} from '@angular/router';
import {beautifyValue} from '../../common/helper';

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
    private navCtrl: NavController,
    private modalController: ModalController,
  ) {
  }

  async ngOnInit() {
    this.form = new TransferForm();

    this.symbols = this.symbols.concat(await this.fetchSymbols());
    // @ts-ignore
    const {symbol, to, amount} = this.route.queryParams.value;
    setTimeout(() => {
      this.form.symbol = symbol || 'EOS';
      this.form.account = to || '';
      if (typeof amount !== 'undefined') {
        this.form.value = beautifyValue('' + (amount || 0));
      }
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
    const actor = await this.accService.current();
    const code = this.filterCode(this.form.symbol);
    const asset = `${this.form.value} ${this.form.symbol}`;
    const modal = await this.modalController.create({
      component: TransactModalComponent,
      cssClass: 'transactModal',
      componentProps: {
        actions: [{
          account: code,
          name: 'transfer',
          authorization: [
            {
              actor,
              permission: 'active'
            }
          ],
          data: {
            from: actor,
            to: this.form.account,
            quantity: asset,
            memo: this.form.memo
          }
        }],
        type: 'transfer'
      },
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
    console.log(this.form);

    const {data} = await modal.onDidDismiss();
    if (data && typeof data.result !== 'undefined') {
      await this.navCtrl.navigateBack('/tabs/assets?refresh=1');
    }

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
    this.form.value = beautifyValue(this.form.value);
  }

  goQRScan() {
    this.navCtrl.navigateForward('/qrscan', {replaceUrl: true});
  }
}
