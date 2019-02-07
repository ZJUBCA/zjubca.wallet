import {Injectable} from '@angular/core';
import {ThemeableBrowser, ThemeableBrowserObject, ThemeableBrowserOptions} from '@ionic-native/themeable-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(
    private browser: ThemeableBrowser
  ) {
  }

  async open(url: string) {
    const options: ThemeableBrowserOptions = {
      toolbar: {
        height: 44,
      },
      title: {
        color: '#1e2023',
        showPageTitle: true
      },
      closeButton: {
        wwwImage: 'assets/icon/close.png',
        align: 'left',
        event: 'closePressed'
      },
      backButton: {
        wwwImage: 'assets/icon/back.png',
        align: 'left',
        event: 'backPressed'
      },
    };

    const browser: ThemeableBrowserObject = this.browser.create(url, '_blank', options);
    browser.insertCss({
      file: 'assets/browser.css'
    });

  }
}
