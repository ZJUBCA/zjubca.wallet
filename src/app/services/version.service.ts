import {Injectable} from '@angular/core';
import axios from '../common/axios';
import {DOWNLOAD_URL, VERSION} from '../common/config';
import {AlertController, ToastController} from '@ionic/angular';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private iab: InAppBrowser
  ) {
  }

  async alert(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000,
      color: 'dark',
      cssClass: 'shortToast'
    });
    await toast.present();
  }

  async checkupdate(showAlert: boolean = true) {
    try {
      const res = await axios.get('checkUpdate');
      const resp = res.data;
      if (!resp.code) {
        if (resp.data.version !== VERSION) {
          // await this.alert('需要更新');
          const alert = await this.alertCtrl.create({
            header: '检测到新版本',
            message: resp.data.changelog,
            buttons: [
              {
                text: '取消',
                role: 'cancel'
              }, {
                text: '更新',
                handler: () => {
                  this.iab.create(DOWNLOAD_URL, '_system');
                }
              }
            ]
          });
          await alert.present();
        } else if (showAlert) {
          await this.alert('已是最新版');
        }
      } else {
        throw new Error(resp.msg);
      }
    } catch (e) {
      await this.alert(e.message);
    }
  }
}
