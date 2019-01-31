import {Component, OnInit} from '@angular/core';
import {ToastController, AlertController} from '@ionic/angular';
import {Route, Router} from '@angular/router';
import axios from '../../common/axios';
import {AccountService} from '../../services/account.service';
import {WalletService} from '../../services/wallet.service';
import {Storage} from '@ionic/storage';

class CreateForm {
  name: string;  // wallet name
  account: string;
  password: string;
  confirmPswd: string;
  inviteCode: string;
  checked: boolean;
}

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit {
  form: CreateForm;
  privateKey: string;
  ecc = window.eosjs_ecc;

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private accService: AccountService,
    private walletService: WalletService,
    private storage: Storage,
    private router: Router
  ) {
    this.form = new CreateForm();
  }

  ngOnInit() {
    this.generatePrivkey();
  }

  async generatePrivkey() {
    this.privateKey = await this.ecc.randomKey();
  }

  async submitForm() {
    console.log(this.form);

    if (!this.form.name) {
      return await this.alert('钱包名不能为空');
    }

    if (!this.form.account) {
      return await this.alert('账号名不能为空');
    }

    if (this.form.account.length !== 12) {
      return await this.alert('账户名长度必须为12位');
    }

    if (!this.form.password) {
      return await this.alert('密码不能为空');
    }

    if (this.form.password.length < 6) {
      return await this.alert('钱包密码须大于6位');
    }

    if (this.form.password !== this.form.confirmPswd) {
      return await this.alert('两次输入密码不一致');
    }

    if (!this.form.inviteCode) {
      return await this.alert('邀请码不能为空');
    }

    const privateKey = this.privateKey;
    const pubKey = this.ecc.privateToPublic(privateKey);
    const warning = await this.alertController.create({
      header: '请务必保存好私钥',
      message: '创建成功后，您也可使用"备份私钥"功能再次显示私钥',
      buttons: [
        {
          text: '再等一会',
          role: 'cancel',
        },
        {
          text: '确认',
          handler: async () => {
            try {
              const res = await axios.post('/signup', {
                account: this.form.account,
                pubKey,
                inviteCode: this.form.inviteCode,
                debug: false
              });
              const resp = res.data;
              if (!resp.code) {
                await this.accService.saveAccounts([{name: this.form.account}]);
                await this.accService.setCurrent(this.form.account);
                await this.walletService.saveWallet(this.form.name, pubKey, privateKey, this.form.password);
                this.router.navigate(['/assets']);
              } else {
                throw new Error(resp.msg);
              }
            } catch (e) {
              this.alert(e.message);
            }
          }
        }
      ]
    });

    await warning.present();
  }

  async alert(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: 'dark'
    });
    toast.present();
  }

}
