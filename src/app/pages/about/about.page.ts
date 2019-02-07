import {Component, OnInit} from '@angular/core';
import {VERSION} from '../../common/config';
import {BrowserService} from '../../services/browser.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  intros: {
    key: string;
    value?: string;
    link?: string;
  }[] = [];

  constructor(
    private browser: BrowserService
  ) {
  }

  ngOnInit() {
    this.intros = [
      {
        key: '版本',
        value: 'v' + VERSION,
      },
      {
        key: '公众号',
        value: 'ZJUBlockchain'
      },
      {
        key: '官方文档',
        link: 'https://docs.zjubca.org'
      }
    ];
  }

  async goOutsideUrl(url) {
    if (typeof url === 'undefined') {
      return;
    }

    this.browser.open(url);
  }
}
