import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LoginPage} from './login.page';
import {LoginRouterModule} from './login-router.module';
import {CreateWalletComponent} from '../../components/create-wallet/create-wallet.component';
import {ImportWalletComponent} from '../../components/import-wallet/import-wallet.component';
import {Clipboard} from '@ionic-native/clipboard/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRouterModule,
  ],
  providers: [Clipboard],
  declarations: [LoginPage, CreateWalletComponent, ImportWalletComponent]
})
export class LoginPageModule {
}
