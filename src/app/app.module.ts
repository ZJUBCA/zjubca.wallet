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
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {IonicStorageModule} from '@ionic/storage';
import {LoginPageModule} from './pages/login/login.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    CoreModule,
    AppRoutingModule,
    SharedModule,
    AssetsPageModule,
    DappPageModule,
    AccountPageModule,
    LoginPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
