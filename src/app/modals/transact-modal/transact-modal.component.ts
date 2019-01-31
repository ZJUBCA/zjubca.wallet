import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {AccountService} from '../../services/account.service';
import {EosService} from '../../services/eos.service';
import {Action} from '../../../classes';

@Component({
  selector: 'app-transact-modal',
  templateUrl: './transact-modal.component.html',
  styleUrls: ['./transact-modal.component.scss']
})
export class TransactModalComponent implements OnInit {

  password: string;

  @Input() actions: Action[];
  @Input() sign = false;

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
      let result = null;
      if (this.sign) {
        await this.modalCtrl.dismiss({
          password: this.password
        });
      } else {
        await this.eosService.init(actor, this.password, ['active', 'owner']);
        result = await this.eosService.createTransaction(this.actions);
      }
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
