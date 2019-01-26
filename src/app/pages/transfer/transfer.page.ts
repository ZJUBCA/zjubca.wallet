import {Component, OnInit} from '@angular/core';
import {EosService} from '../../core/eos.service';
import {AccountService} from '../../core/account.service';
import {ModalController} from '@ionic/angular';
import {TransactModalComponent} from '../../modal/transact-modal/transact-modal.component';

// import {QRScannerOriginal, QRScannerStatus} from '@ionic-native/qr-scanner';

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

  constructor(
    private eosService: EosService,
    private accService: AccountService,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.form = new TransferForm();
  }

  async qrScan() {
    //   try {
    //     const status: QRScannerStatus = await this.qrScanner.prepare();
    //     if (status.authorized) {
    //       // camera permission was granted
    //       const scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //         console.log('scanned somthing', text);
    //         this.qrScanner.hide();
    //         scanSub.unsubscribe();
    //       });
    //     } else if (status.denied) {
    //
    //     } else {
    //
    //     }
    //   } catch (e) {
    //
    //   }
  }

  async transfer() {
    // this.eosService.init(name, '123', ['active']);
    const modal = await this.modalController.create({
      component: TransactModalComponent,
      cssClass: 'transactModal',
      componentProps: {},
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
    console.log(this.form);

    const {data} = await modal.onDidDismiss();
    if (data && data.password) {
      console.log(data.password);
      const actor = await this.accService.current();
      this.eosService.init(name, data.password, ['active']);
      this.eosService.sendTx([{
        account: this.filterCode(this.form.symbol),
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
          asset: `${this.form.value} ${this.form.symbol}`
        }
      }]);
    }
  }

  /**
   * filterCode filters and returns the target contract code with the given symbol type.
   */
  filterCode(symbol: string): string {
    switch (symbol) {
      case 'EOS':
        return 'eosio.token';
      case 'ZJUBCA':
        return 'zjubcatokent';
      default:
        return 'eosio.token';
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
