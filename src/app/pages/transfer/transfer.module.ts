import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TransferPage} from './transfer.page';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';

const routes: Routes = [
  {
    path: '',
    component: TransferPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransferPage, TransactModalComponent]
})
export class TransferPageModule {
}
