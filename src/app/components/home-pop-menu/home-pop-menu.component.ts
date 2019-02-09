import {Component, OnInit} from '@angular/core';
import {NavController, PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-pop-menu',
  templateUrl: './home-pop-menu.component.html',
  styleUrls: ['./home-pop-menu.component.scss']
})
export class HomePopMenuComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) {
  }

  ngOnInit() {
  }

  async nav(url) {
    await this.navCtrl.navigateForward(url);
    await this.popoverCtrl.dismiss();
  }
}
