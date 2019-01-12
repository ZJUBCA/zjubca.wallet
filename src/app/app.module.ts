import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {EosService} from './eos.service'
import {SecureStorage} from '@ionic-native/secure-storage/ngx';
import {AssetsPageModule} from './pages/assets/assets.module'
import {Tab1PageModule} from './pages/tab1/tab1.module'
import {SharedModule} from './shared/shared.module'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AssetsPageModule,
    Tab1PageModule,
    SharedModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SecureStorage,
    EosService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
