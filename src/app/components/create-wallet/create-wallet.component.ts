import {Component, OnInit} from '@angular/core';
import {ToastController, AlertController, LoadingController, NavController} from '@ionic/angular';
import axios from '../../common/axios';
import {AccountService} from '../../services/account.service';
import {WalletService} from '../../services/wallet.service';
import {Storage} from '@ionic/storage';
import {EosService} from '../../services/eos.service';
import {Clipboard} from '@ionic-native/clipboard/ngx';

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
    private eosService: EosService,
    private storage: Storage,
    private navCtrl: NavController,
    private clipboard: Clipboard,
    private loadingCtrl: LoadingController
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

    if (/[^a-z1-5]/.test(this.form.account)) {
      return await this.alert('账户名不合法');
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

    const privateKey = this.privateKey;
    const pubKey = this.ecc.privateToPublic(privateKey);
    const warning = await this.alertController.create({
      header: '请务必保存好私钥',
      message: '创建成功后，您也可使用"导出私钥"功能再次显示私钥',
      buttons: [
        {
          text: '再等一会',
          role: 'cancel',
        },
        {
          text: '确认',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: '创建中...',
              spinner: 'crescent'
            });
            try {
              await loading.present();

              const name = this.form.account;
              const res = await axios.post('/signup', {
                account: name,
                pubKey,
                inviteCode: this.form.inviteCode,
                debug: false
              });
              const resp = res.data;
              console.log(resp);
              if (!resp.code) {
                const account = await this.eosService.getAccount(name);
                let permissions = account.permissions.filter(item => item.required_auth.keys[0].key === pubKey);
                permissions = permissions.map(item => ({
                  permission: item.perm_name,
                  publicKey: pubKey
                }));
                await this.accService.saveAccounts([{
                  name: name,
                  permissions: permissions
                }]);
                await this.walletService.saveWallet(this.form.name, pubKey, privateKey, this.form.password);
                const curr = await this.accService.current();
                if (!curr) {
                  await this.accService.setCurrent(name);
                  await this.navCtrl.navigateRoot('/tabs/assets');
                } else {
                  await this.navCtrl.navigateBack('/tabs/assets', {replaceUrl: true});
                }
                this.form = new CreateForm();
              } else {
                throw new Error(resp.msg);
              }
            } catch (e) {
              await this.alert(e.message);
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await warning.present();
  }

  async copy() {
    try {
      await this.clipboard.copy(this.privateKey);
      await this.alert('已复制', 2000);
    } catch (e) {
      console.log(e);
    }
  }

  async alert(msg: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'middle',
      duration: duration,
      color: 'dark'
    });
    await toast.present();
  }

}
