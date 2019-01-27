import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDetailPage } from './token-detail.page';

describe('TokenDetailPage', () => {
  let component: TokenDetailPage;
  let fixture: ComponentFixture<TokenDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
