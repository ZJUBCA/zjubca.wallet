import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountService} from './account.service';
import {EosService} from './eos.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AccountService,
    EosService,
  ],
})
export class CoreModule { }
