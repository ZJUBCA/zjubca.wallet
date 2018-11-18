import {Bloc} from 'jorum'
import {BehaviorSubject} from 'rxjs'
import {accountService} from '../services/account.service'

export class AccountBloc extends Bloc {
  current$ = new BehaviorSubject(null)
  accounts$ = new BehaviorSubject([])

  constructor() {
    super()
    this.fetchCurrent()
    this.fetchAccounts()
  }

  async fetchCurrent() {
    this.current$.next(
      await accountService.getCurrent()
    )
  }

  async fetchAccounts() {
    this.accounts$.next(
      await accountService.getAccounts()
    )
  }

  async addAccount(name) {
    await this.fetchAccounts()
    const accounts = this.accounts$.value
    accounts.push({
      name: 'zjuwalletapp',
      privateKey: '5JCfVMhq62LR8iRsRALTHnZ98EuhpQ9wX4YJzTjzzPDxBbiBSPN'
    })
    accountService.setAccounts(name, accounts)
  }

}
