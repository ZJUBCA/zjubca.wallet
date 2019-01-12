import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountCardComponent} from './account-card/account-card.component'

@NgModule({
  declarations: [
    AccountCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AccountCardComponent
  ]
})
export class SharedModule { }
