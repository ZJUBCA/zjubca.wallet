import {Component, OnInit} from '@angular/core';
import {EosService} from '../../eos.service'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  constructor(
    public eosService: EosService,
  ) {}
  
  async ngOnInit() {
    this.balance = await this.eosService.getBalance()
  }
  
  balance: string
}
