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
  static whitelist = {};

  constructor() {
  }

  static getPermission(origin: string): Account {
    return PermissionService.permissions[origin];
  }

  static setPermission(origin: string, account: Account) {
    PermissionService.permissions[origin] = account;
  }

  static delPermission(origin: string) {
    delete PermissionService.permissions[origin];
  }

  static isInWhitelist(origin: string): boolean {
    return typeof PermissionService.whitelist[origin] !== undefined;
  }

  static clearWhitelist(origin: string) {
    delete PermissionService.whitelist[origin];
  }
}
