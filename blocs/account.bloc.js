import {Bloc} from 'jorum'
import {BehaviorSubject} from 'rxjs'
import {accountService} from '../services/account.service'

export class AccountBloc extends Bloc {
  current = new BehaviorSubject(null)

  constructor() {
    super()
    this.fetchCurrent()
  }

  async fetchCurrent() {
    this.current.next(
      await accountService.getCurrent()
    )
  }

}
