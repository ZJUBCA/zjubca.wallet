import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-pop-menu',
  templateUrl: './home-pop-menu.component.html',
  styleUrls: ['./home-pop-menu.component.scss']
})
export class HomePopMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController
  ) {
  }

  ngOnInit() {
  }

  async nav(url) {
    await this.router.navigateByUrl(url);
    await this.popoverCtrl.dismiss();
  }
}
