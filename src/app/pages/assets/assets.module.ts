import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssetsPage } from './assets.page';
import {SharedModule} from '../../shared/shared.module'

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
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AssetsPage]
})
export class AssetsPageModule {}
