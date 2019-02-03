import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ExportKeyPage} from './export-key.page';
import {Clipboard} from '@ionic-native/clipboard/ngx';

const routes: Routes = [
  {
    path: '',
    component: ExportKeyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [Clipboard],
  declarations: [ExportKeyPage]
})
export class ExportKeyPageModule {
}
