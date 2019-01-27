import {Component, OnInit} from '@angular/core';
import axios from '../../common/axios';
import {tokenCode, tokensUrl} from '../../common/config';
import {Token} from '../../../classes';
import {EosService} from '../../core/eos.service';
import {AccountService} from '../../core/account.service';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.page.html',
  styleUrls: ['./tokens.page.scss'],
})
export class TokensPage implements OnInit {

  tokens: Token[];

  constructor(
    private eosService: EosService,
    private accService: AccountService
  ) {
  }

  async ngOnInit() {
    this.tokens = await this.fetchTokens();
    await this.getBalances();
  }

  async fetchTokens(): Promise<Token[]> {
    try {
      const result = await axios.get(tokensUrl);
      return result.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getBalances() {
    const name = await this.accService.current();
    const tokens = await this.eosService.getTokenBalance(tokenCode, name);
    tokens.forEach(token => {
      const entries = token.split(' ');
      const val = entries[0];
      const symbol = entries[1];
      const ind = this.tokens.findIndex(item => item.symbol === symbol);
      if (ind >= 0) {
        this.tokens[ind].value = val;
      }
    });
    console.log(tokens);
  }

}
