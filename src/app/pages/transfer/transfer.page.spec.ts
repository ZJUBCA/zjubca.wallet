import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPage } from './transfer.page';

describe('TransferPage', () => {
  let component: TransferPage;
  let fixture: ComponentFixture<TransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
