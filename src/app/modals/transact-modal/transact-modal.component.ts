import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {AccountService} from '../../services/account.service';
import {EosService} from '../../services/eos.service';
import {Action} from '../../../classes';
import {AbiService} from '../../services/abi.service';
import {READABLE_TYPES} from '../../common/dappApi';

@Component({
  selector: 'app-transact-modal',
  templateUrl: './transact-modal.component.html',
  styleUrls: ['./transact-modal.component.scss']
})
export class TransactModalComponent implements OnInit {

  password: string;
  whitelist: boolean;

  @Input() actions: Action[];
  @Input() sign = false;
  @Input() type: string;

  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private accService: AccountService,
    private eosService: EosService,
    private abiService: AbiService
  ) {
  }

  async ngOnInit() {
    this.type = READABLE_TYPES[this.type];
    if (this.sign && this.actions) {
      const abis = await this.abiService.getAbis(this.actions.map(item => item.account));
      this.actions = await Promise.all(this.actions.map(async action => {
        const abi = abis[action.account];
        const typeName = abi.actions.find(x => x.name === action.name).type;
        action.data = this.abiService.deserializeData(action.data, abi, typeName);
        return action;
      }));
    }
  }

  get formatData() {
    return JSON.stringify(this.actions, null, 4);
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
          password: this.password,
          whitelist: this.whitelist
        });
      } else {
        await this.eosService.init(actor, this.password, ['active', 'owner']);
        result = await this.eosService.sendTransaction(this.actions);
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
