import {Component, ElementRef, OnInit} from '@angular/core';

@Component({
  selector: 'app-dapp-container',
  templateUrl: './dapp-container.page.html',
  styleUrls: ['./dapp-container.page.scss'],
})
export class DappContainerPage implements OnInit {

  constructor(
    private el: ElementRef
  ) {
  }

  ngOnInit() {
    console.log(this.el.nativeElement.querySelector('.browser'));
    window.addEventListener('message', this.handleMsg);
  }

  handleMsg(ev) {
    const protocol = ev.data.protocol;
    if (!protocol || protocol.indexOf('scatter') < 0) {
      return;
    }

    const data = ev.data;
    console.log(data);
  }
}
