import {Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@ionic-native/in-app-browser';

@Component({
  selector: 'app-dapp',
  templateUrl: './dapp.page.html',
  styleUrls: ['./dapp.page.scss'],
})
export class DappPage implements OnInit {

  constructor() {
  }

  ngOnInit() {
    const browser = InAppBrowser.create('https://www.baidu.com');
  }

}
