import {Component, OnInit} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';


@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  picture: string;

  constructor(
    private qrScanner: QRScanner,
  ) {
  }

  async ngOnInit() {
    this.qrScan();
  }

  async qrScan() {
    try {
      const status: QRScannerStatus = await this.qrScanner.prepare();
      if (status.authorized) {
        console.log('open scanner');
        // camera permission was granted
        const scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('scanned somthing', text);
          this.qrScanner.hide();
          scanSub.unsubscribe();
        });

        await this.qrScanner.show();
      } else if (status.denied) {

      } else {

      }
    } catch (e) {

    }
  }

}
