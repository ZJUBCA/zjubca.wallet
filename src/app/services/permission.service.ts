import {Injectable} from '@angular/core';
import {Account} from '../common/dappApi';

/**
 * PermissionService provides a cache service for `origin` => `account`
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  static permissions = {};

  constructor() {
  }

  static getPermission(origin: string): Account {
    return PermissionService.permissions[origin];
  }

  static setPermission(origin: string, account: Account) {
    PermissionService.permissions[origin] = account;
  }

  static rmPermission(origin: string) {
    delete PermissionService.permissions[origin];
  }

}
