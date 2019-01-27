import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {AccountService} from '../../core/account.service';
import {EosService} from '../../core/eos.service';

@Component({
  selector: 'app-transact-modal',
  templateUrl: './transact-modal.component.html',
  styleUrls: ['./transact-modal.component.scss']
})
export class TransactModalComponent implements OnInit {

  password: string;

  @Input() code: string;
  @Input() asset: string;
  @Input() to: string;
  @Input() memo: string;

  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private accService: AccountService,
    private eosService: EosService,
  ) {
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async submit() {
    // await this.modalCtrl.dismiss({
    //   password: this.password
    // });

    console.log(this.password);
    if (!this.password) {
      return await this.alert('钱包密码不能为空');
    }
    try {
      const actor = await this.accService.current();
      await this.eosService.init(actor, this.password, ['active', 'owner']);
      const result = await this.eosService.sendTx([{
        account: this.code,
        name: 'transfer',
        authorization: [
          {
            actor,
            permission: 'active'
          }
        ],
        data: {
          from: actor,
          to: this.to,
          quantity: this.asset,
          memo: this.memo
        }
      }]);
      console.log(result);
    } catch (e) {
      console.log(e);
      await this.alert(e.message);
    }
  }

  async alert(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3000,
      color: 'dark'
    });
    toast.present();

  }

}
