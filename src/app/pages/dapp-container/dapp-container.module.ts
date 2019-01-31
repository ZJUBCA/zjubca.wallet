import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {DappContainerPage} from './dapp-container.page';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';

const routes: Routes = [
  {
    path: '',
    component: DappContainerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [TransactModalComponent],
  declarations: [DappContainerPage, TransactModalComponent]
})
export class DappContainerPageModule {
}
