import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NftPage } from './nft.page';

describe('NftPage', () => {
  let component: NftPage;
  let fixture: ComponentFixture<NftPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NftPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
