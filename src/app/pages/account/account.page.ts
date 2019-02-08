import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
  }

  async alert(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
      color: 'dark',
      cssClass: 'shortToast'
    });
    await toast.present();
  }
}
