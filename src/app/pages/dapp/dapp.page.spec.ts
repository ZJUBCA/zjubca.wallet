import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DappPage } from './dapp.page';

describe('DappPage', () => {
  let component: DappPage;
  let fixture: ComponentFixture<DappPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DappPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
