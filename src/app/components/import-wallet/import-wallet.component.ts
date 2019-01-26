import {Component, OnInit} from '@angular/core';

class ImportForm {
  privKey: string;
  password: string;
  confirmPswd: string;
  checked: boolean;
}

@Component({
  selector: 'app-import-wallet',
  templateUrl: './import-wallet.component.html',
  styleUrls: ['./import-wallet.component.scss']
})
export class ImportWalletComponent implements OnInit {
  form: ImportForm;

  constructor() {
    this.form = new ImportForm();
  }

  ngOnInit() {
  }

  async submitForm() {
    console.log(this.form)
  }

}
