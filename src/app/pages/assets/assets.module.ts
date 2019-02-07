import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetsPage} from './assets.page';
import {HomePopMenuComponent} from '../../components/home-pop-menu/home-pop-menu.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [HomePopMenuComponent],
  declarations: [AssetsPage, HomePopMenuComponent]
})
export class AssetsPageModule {
}
