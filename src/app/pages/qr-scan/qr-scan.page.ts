import {Component, OnInit} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions} from '@ionic-native/camera-preview/ngx';


@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  picture: string;

  constructor(
    private qrScanner: QRScanner,
    private cameraPreview: CameraPreview
  ) {
  }

  async ngOnInit() {
    try {
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

      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        });
      const pictureOpts: CameraPreviewPictureOptions = {
        width: 1280,
        height: 1280,
        quality: 85
      };

      // take a picture
      this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        console.log(err);
        this.picture = 'assets/img/test.jpg';
      });
    } catch (e) {
      console.log(e);
    }

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
