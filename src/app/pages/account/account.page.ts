import {Component, OnInit} from '@angular/core';
import {VersionService} from '../../services/version.service';
import {Device} from '@ionic-native/device/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  showCheckUpdate = true;

  constructor(
    private versionSvc: VersionService,
    private device: Device,
  ) {

  }

  ngOnInit() {
    if (this.device.platform === 'iOS') {
      this.showCheckUpdate = false;
    }
  }

  async checkUpdate() {
    await this.versionSvc.checkupdate();
  }
}
