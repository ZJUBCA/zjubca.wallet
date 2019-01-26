import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPage } from './bill.page';

describe('BillPage', () => {
  let component: BillPage;
  let fixture: ComponentFixture<BillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
