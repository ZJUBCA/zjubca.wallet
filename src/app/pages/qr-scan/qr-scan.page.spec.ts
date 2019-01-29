import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScanPage } from './qr-scan.page';

describe('QrScanPage', () => {
  let component: QrScanPage;
  let fixture: ComponentFixture<QrScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrScanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
