import { TestBed } from '@angular/core/testing';

import { EosService } from './eos.service';

describe('EosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EosService = TestBed.get(EosService);
    expect(service).toBeTruthy();
  });
});
