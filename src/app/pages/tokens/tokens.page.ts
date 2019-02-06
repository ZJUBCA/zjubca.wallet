import {Component, OnInit} from '@angular/core';
import axios from '../../common/axios';
import {tokenCode, tokensUrl} from '../../common/config';
import {Token} from '../../../classes';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.page.html',
  styleUrls: ['./tokens.page.scss'],
})
export class TokensPage implements OnInit {

  tokens: Token[];
  loading = false;

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
      this.loading = true;
      const result = await axios.get(tokensUrl);
      return result.data;
    } catch (e) {
      console.log(e);
      return [];
    } finally {
      this.loading = false;
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
        this.tokens[ind].value = val || 0;
      }
    });
    console.log(tokens);
  }

}
