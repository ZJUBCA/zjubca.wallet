import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePopMenuComponent } from './home-pop-menu.component';

describe('HomePopMenuComponent', () => {
  let component: HomePopMenuComponent;
  let fixture: ComponentFixture<HomePopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
