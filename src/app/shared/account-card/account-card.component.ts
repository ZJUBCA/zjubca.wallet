import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent implements OnInit {

  constructor() { }
  
  @Input() account?;

  ngOnInit() {
  }

}
