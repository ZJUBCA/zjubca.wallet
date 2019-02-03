import {Component, OnInit} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions} from '@ionic-native/camera-preview/ngx';


@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  constructor(
    private qrScanner: QRScanner,
    private cameraPreview: CameraPreview
  ) {
  }

  async ngOnInit() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    };

    await this.cameraPreview.startCamera(cameraPreviewOpts);

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
      } else if (status.denied) {

      } else {

      }
    } catch (e) {

    }
  }

}
