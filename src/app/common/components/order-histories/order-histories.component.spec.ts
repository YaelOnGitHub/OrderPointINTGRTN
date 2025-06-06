import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoriesComponent } from './order-histories.component';

describe('OrderHistoriesComponent', () => {
  let component: OrderHistoriesComponent;
  let fixture: ComponentFixture<OrderHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
