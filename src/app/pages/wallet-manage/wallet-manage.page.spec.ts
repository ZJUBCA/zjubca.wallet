import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagePage } from './wallet-manage.page';

describe('WalletManagePage', () => {
  let component: WalletManagePage;
  let fixture: ComponentFixture<WalletManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletManagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
