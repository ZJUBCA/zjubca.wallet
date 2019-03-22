import {Component, OnInit} from '@angular/core';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';
import axios from '../../common/axios';
import {tokensUrl} from '../../common/config';
import {ActivatedRoute} from '@angular/router';
import {Token} from '../../../classes';

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
  tokens: Token[];

  constructor(
    private eosService: EosService,
    private accService: AccountService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalController: ModalController,
    private toastCtrl: ToastController,
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
        this.form.value = (+amount || 0).toFixed(4);
      }
    });
  }

  async fetchSymbols(): Promise<string[]> {
    try {
      const result = await axios.get(tokensUrl);
      this.tokens = result.data;
      return this.tokens.map(item => item.symbol);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async transfer() {
    // this.eosService.init(name, '123', ['active']);
    const actor = await this.accService.current();
    const code = this.filterCode(this.form.symbol);
    if (!code) {
      await this.alert('找不到对应的Token合约');
      return await this.navCtrl.pop();
    }
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
    // console.log(this.form);

    const {data} = await modal.onDidDismiss();
    if (data && typeof data.result !== 'undefined') {
      await this.alert('转账成功');
      setTimeout(() => {
        this.navCtrl.navigateBack('/tabs/assets?refresh=1');
      }, 250);
    }

  }

  async alert(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000,
      cssClass: 'shortToast',
      color: 'dark'
    });
    await toast.present();
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
        const code = this.tokens.find(x => x.symbol === symbol);
        return code && code.account;
    }
  }

  valueBlur() {
    this.form.value = (+this.form.value || 0).toFixed(4);
  }

  goQRScan() {
    this.navCtrl.navigateForward('/qrscan', {replaceUrl: true});
  }
}
