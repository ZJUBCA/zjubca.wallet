import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  qrcode: string;

  constructor() {
  }

  ngOnInit() {
    this.qrcode = 'https://docs.zjubca.org';
  }

}
