import {Component, OnInit} from '@angular/core';
import {PhotoLibrary} from '@ionic-native/photo-library/ngx';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  album = 'zjubca.wallet';
  url = 'https://ws3.sinaimg.cn/large/66bb17eely1g0vut0yukrj21iw2pke81.jpg';

  constructor(
    private photoLibrary: PhotoLibrary,
    private toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
  }

  async saveImg() {
    try {
      await this.photoLibrary.requestAuthorization({
        write: true
      });

      await this.photoLibrary.saveImage(this.url, this.album);
      await this.alert('图片保存成功');
    } catch (e) {
      await this.alert(e);
    }
  }

  async alert(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      cssClass: 'shortToast',
      duration: 2500,
      color: 'dark'
    });
    await toast.present();
  }
}
