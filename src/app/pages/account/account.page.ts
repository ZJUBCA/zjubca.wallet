import {Component, OnInit} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {VersionService} from '../../services/version.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private versionSvc: VersionService
  ) {

  }

  ngOnInit() {
  }

  async checkUpdate() {
    await this.versionSvc.checkupdate();
  }
}
