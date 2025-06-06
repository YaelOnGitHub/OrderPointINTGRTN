import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferHistoryDetailComponent } from './transfer-history-details.component';

describe('ViewOrderDetailsComponent', () => {
  let component: ViewTransferHistoryDetailComponent;
  let fixture: ComponentFixture<ViewTransferHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransferHistoryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransferHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
