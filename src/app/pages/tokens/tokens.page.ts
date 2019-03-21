import {Component, OnInit} from '@angular/core';
import axios from '../../common/axios';
import {tokensUrl} from '../../common/config';
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
    this.tokens.map(async info => {
      const tokens = await this.eosService.getTokenBalance(info.account, name);
      const token = tokens.find(str => {
        return str.split(' ')[1] === info.symbol;
      });
      if (token) {
        info.value = token.split(' ')[0];
      } else {
        info.value = '0';
      }
      return info;
    });
    // console.log(tokens);
  }

}
