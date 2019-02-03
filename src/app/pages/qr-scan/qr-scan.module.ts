import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {QrScanPage} from './qr-scan.page';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';
import {CameraPreview} from '@ionic-native/camera-preview/ngx';

const routes: Routes = [
  {
    path: '',
    component: QrScanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [QRScanner, CameraPreview],
  declarations: [QrScanPage]
})
export class QrScanPageModule {
}
