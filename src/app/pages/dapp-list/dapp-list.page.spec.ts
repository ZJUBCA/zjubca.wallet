import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DappListPage } from './dapp-list.page';

describe('DappListPage', () => {
  let component: DappListPage;
  let fixture: ComponentFixture<DappListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DappListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DappListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
