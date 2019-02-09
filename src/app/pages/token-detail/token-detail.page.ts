import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import axios from '../../common/axios';
import {endpoints, timezone, tokenCode, tokensUrl} from '../../common/config';
import {ToastController} from '@ionic/angular';
import {Token} from '../../../classes';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';
import {NetworkService} from '../../services/network.service';
import * as moment from 'moment';

interface HistoryAction {
  from: string;
  to: string;
  quantity: string;
  time: string;
  type: number;  // 0 bill, 1 pay
}

@Component({
  selector: 'app-token-detail',
  templateUrl: './token-detail.page.html',
  styleUrls: ['./token-detail.page.scss'],
})
export class TokenDetailPage implements OnInit {

  symbol: string;
  tokenInfo: Token = {
    account: '',
    intro: '',
    logo: '',
    symbol: '',
    value: ''
  };

  balance: string;

  historyActions: HistoryAction[] = [];
  noMoreActions = false;
  noSupportActions = false;
  actionsLoading = false;
  pos = 1;
  offset = 30;

  constructor(
    private routes: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private eosService: EosService,
    private accService: AccountService,
    private networkService: NetworkService
  ) {
  }

  async ngOnInit() {
    // @ts-ignore
    this.symbol = this.routes.params.value.symbol;
    this.fetchDetails();
    this.getBalance();
    const currPeer = await this.networkService.getNetwork();
    if (endpoints.actions.findIndex(x => x.name === currPeer.name) < 0) {
      this.noSupportActions = true;
    } else {
      this.getHistoryActions();
    }
  }

  async fetchDetails() {
    try {
      const result = await axios.get(tokensUrl);
      console.log(result);
      this.tokenInfo = result.data.find(item => item.symbol === this.symbol);
    } catch (e) {
      console.log(e);
      await this.alert('网络异常，请重试');
    }
  }

  async getBalance() {
    try {
      const name = await this.accService.current();
      const token = await this.eosService.getTokenBalance(tokenCode, name, this.symbol);
      if (token.length === 0) {
        this.balance = '0';
      } else {
        this.balance = token[0].split(' ')[0];
      }
    } catch (e) {
      await this.alert('网络异常，请重试');
    }
  }

  async alert(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: 'dark'
    });
    toast.present();

  }

  goTransfer() {
    this.router.navigateByUrl(`/transfer?symbol=${this.symbol}`);
  }

  goBill() {
    this.router.navigateByUrl(`/bill?symbol=${this.symbol}`);
  }

  async getHistoryActions() {
    if (this.actionsLoading) {
      return;
    }
    try {
      this.actionsLoading = true;
      const name = await this.accService.current();
      const result = await this.eosService.getActions(name, this.pos, this.offset);
      const trxIds = {};

      if (result.actions.length < this.offset + 1) {
        this.noMoreActions = true;
      } else {
        this.pos += this.offset + 1;
      }

      // filter duplicate transactions
      result.actions = result.actions.filter(item => {
        const trxId = item.action_trace.trx_id;

        // filter duplicate trx
        if (trxIds[trxId]) {
          return false;
        }

        // filter contract account
        if (item.action_trace.act.account !== tokenCode) {
          return false;
        }

        // filter action name
        if (item.action_trace.act.name !== 'transfer') {
          return false;
        }

        // filter token symbol
        if (item.action_trace.act.data.quantity.split(' ')[1] !== this.symbol) {
          return false;
        }

        trxIds[trxId] = 1;
        return true;
      });

      // reconstruct the actions array
      const actions = result.actions.map(item => {
        const {from, to, quantity} = item.action_trace.act.data;
        const type = name === from ? 1 : 0;
        return {
          from,
          to,
          quantity: quantity.split(' ')[0],
          type,
          time: moment(item.action_trace.block_time).utcOffset(timezone).format('YYYY-MM-DD HH:mm:ss')
        };
      });
      if (actions.length === 0 && !this.noMoreActions) {
        this.actionsLoading = false;
        return await this.getHistoryActions();
      }
      this.historyActions = this.historyActions.concat(actions);
      // console.log(this.historyActions);
    } catch (e) {
      console.log(e);
      await this.alert('获取交易记录失败');
    } finally {
      this.actionsLoading = false;
    }
  }

  async loadData(event) {
    await this.getHistoryActions();
    event.target.complete();
  }
}
