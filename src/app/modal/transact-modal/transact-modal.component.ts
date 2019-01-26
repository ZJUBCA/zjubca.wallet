import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-transact-modal',
  templateUrl: './transact-modal.component.html',
  styleUrls: ['./transact-modal.component.scss']
})
export class TransactModalComponent implements OnInit {

  password: string;

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async submit() {
    await this.modalCtrl.dismiss({
      password: this.password
    });
  }

}
