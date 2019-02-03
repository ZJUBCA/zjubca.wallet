import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-export-key',
  templateUrl: './export-key.page.html',
  styleUrls: ['./export-key.page.scss'],
})
export class ExportKeyPage implements OnInit {

  privateKey: string;

  constructor(
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    private toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
    // @ts-ignore
    this.privateKey = this.route.params.value.privkey;
  }

  async copy() {
    try {
      await this.clipboard.copy(this.privateKey);
      const toast = await this.toastCtrl.create({
        message: '已复制',
        position: 'bottom',
        duration: 2000,
        cssClass: 'shortToast',
        color: 'dark'
      });
      await toast.present();
    } catch (e) {
      console.log(e);
    }
  }
}
