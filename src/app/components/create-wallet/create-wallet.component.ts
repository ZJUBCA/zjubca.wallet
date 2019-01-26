import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';

class CreateForm {
  name: string;
  password: string;
  confirmPswd: string;
  checked: boolean;
}

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit {
  form: CreateForm;

  constructor(public toastController: ToastController) {
    this.form = new CreateForm();
  }

  ngOnInit() {
  }


  async submitForm() {
    console.log(this.form);

    if (!this.form.name) {
      return this.alert('账号名不能为空');
    }

    if (!this.form.password) {
      return this.alert('密码不能为空');
    }

    if (this.form.password !== this.form.confirmPswd) {
      return this.alert('两次输入密码不一致');
    }
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
