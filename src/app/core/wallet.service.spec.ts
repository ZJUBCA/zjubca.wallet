import {TestBed} from '@angular/core/testing';

import {WalletService} from './wallet.service';

describe('WalletService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalletService = TestBed.get(WalletService);
    expect(service).toBeTruthy();
  });

  it('encrypt&decrypt a message', async () => {
    const service = TestBed.get(WalletService);
    service.saveKey('publickey', 'privatekey', 'password');
    const privkey = service.retrieveKey('publickey', 'password');
    expect(privkey).toEqual('privatekey');
  });
});
