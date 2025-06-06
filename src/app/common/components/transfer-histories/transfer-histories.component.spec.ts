import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferHistoriesComponent } from './transfer-histories.component';

describe('TransferHistoriesComponent', () => {
  let component: TransferHistoriesComponent;
  let fixture: ComponentFixture<TransferHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferHistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
