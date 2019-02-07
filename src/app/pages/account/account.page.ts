import {Component, OnInit} from '@angular/core';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private socialSharing: SocialSharing
  ) {
  }

  ngOnInit() {
  }

  async share() {
    const result = await this.socialSharing.shareWithOptions({
      message: '分享zjubca.wallet'
    });
    console.log(result);
  }

}
