import { TestBed } from '@angular/core/testing';

import { AbiService } from './abi.service';

describe('AbiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbiService = TestBed.get(AbiService);
    expect(service).toBeTruthy();
  });
});
