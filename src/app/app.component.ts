import {Component} from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AccountService} from './services/account.service';
import {VersionService} from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private accService: AccountService,
    private versionSvc: VersionService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    const accounts = await this.accService.fetchAccounts();
    if (accounts.length === 0) {
      await this.navCtrl.navigateRoot('/login', {replaceUrl: true});
    } else {
      await this.navCtrl.navigateRoot('/tabs/assets', {replaceUrl: true});
    }

    // check update
    await this.versionSvc.checkupdate(false);
  }
}
