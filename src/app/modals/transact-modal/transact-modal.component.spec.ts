import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactModalComponent } from './transact-modal.component';

describe('TransactModalComponent', () => {
  let component: TransactModalComponent;
  let fixture: ComponentFixture<TransactModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
