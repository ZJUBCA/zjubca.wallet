import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AssetsPageModule} from './pages/assets/assets.module';
import {DappPageModule} from './pages/dapp/dapp.module';
import {AccountPageModule} from './pages/account/account.module';
import {CoreModule} from './services/core.module';
import {IonicStorageModule} from '@ionic/storage';
import {LoginPageModule} from './pages/login/login.module';
import {TokensPageModule} from './pages/tokens/tokens.module';
import {NftPageModule} from './pages/nft/nft.module';
import {TransactModalComponent} from './modals/transact-modal/transact-modal.component';
import {DappContainerPageModule} from './pages/dapp-container/dapp-container.module';
import {TransferPageModule} from './pages/transfer/transfer.module';
import {WalletDetailPageModule} from './pages/wallet-detail/wallet-detail.module';
import {ThemeableBrowser} from '@ionic-native/themeable-browser/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [TransactModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    CoreModule,
    AppRoutingModule,
    AssetsPageModule,
    DappPageModule,
    AccountPageModule,
    LoginPageModule,
    TokensPageModule,
    NftPageModule,
    DappContainerPageModule,
    TransferPageModule,
    WalletDetailPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ThemeableBrowser,
    InAppBrowser,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
