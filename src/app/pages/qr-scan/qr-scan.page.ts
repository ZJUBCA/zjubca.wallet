import {Component, OnDestroy, OnInit} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {QRData} from '../../../classes';
import {NavController} from '@ionic/angular';


@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit, OnDestroy {

  noCameraPermission = false;
  errorMessage: string;

  constructor(
    private qrScanner: QRScanner,
    private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.qrScan();
  }

  ngOnDestroy() {
    this.qrScanner.hide();
    this.qrScanner.pausePreview();
    this.qrScanner.destroy();
  }

  async qrScan() {
    try {
      const status: QRScannerStatus = await this.qrScanner.prepare();
      if (status.authorized) {
        // console.log('open scanner');
        // camera permission was granted
        const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
          // console.log('scanned somthing', text);
          const data: QRData = JSON.parse(text);
          if (data.action === 'transfer') {
            let url = `/transfer?symbol=${data.symbol}&to=${data.to}`;
            if (data.amount !== 0) {
              url += `&amount=${data.amount}`;
            }
            await this.navCtrl.pop();
            await this.navCtrl.navigateForward(url, {replaceUrl: true});
            scanSub.unsubscribe();
          }
        });

        this.qrScanner.resumePreview();

        this.qrScanner.show();
      } else {
        this.noCameraPermission = true;
        this.errorMessage = '无法获取相机权限';
      }
    } catch (e) {
      this.noCameraPermission = true;
      this.errorMessage = e.errorMsg;
    }
  }

}
