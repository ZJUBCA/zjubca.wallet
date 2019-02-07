import {Component, OnInit} from '@angular/core';
import {VERSION} from '../../common/config';
import {ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject} from '@ionic-native/themeable-browser/ngx';

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
    private browser: ThemeableBrowser
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

  goOutsideUrl(url) {
    if (typeof url === 'undefined') {
      return;
    }

    const options: ThemeableBrowserOptions = {
      toolbar: {
        height: 44,
      },
      title: {
        color: '#1e2023',
        showPageTitle: true
      },
      closeButton: {
        wwwImage: 'assets/icon/favicon.png',
        align: 'left',
        event: 'closePressed'
      },
      backButton: {
        wwwImage: 'assets/icon/back.png',
        align: 'left',
        event: 'backPressed'
      },
      customButtons: [
        {
          image: 'share',
          imagePressed: 'share_pressed',
          align: 'right',
          event: 'sharePressed'
        }
      ],
      backButtonCanClose: true
    };

    const browser: ThemeableBrowserObject = this.browser.create(url, '_blank', options);
    browser.insertCss({
      code: 'html{ padding-top:44px; }'
    });
  }
}
