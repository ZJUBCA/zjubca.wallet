import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DappContainerPage } from './dapp-container.page';

describe('DappContainerPage', () => {
  let component: DappContainerPage;
  let fixture: ComponentFixture<DappContainerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DappContainerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DappContainerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
