import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartConventionShipmentComponent } from './cart-convention-shipment.component';

describe('CartConventionShipmentComponent', () => {
  let component: CartConventionShipmentComponent;
  let fixture: ComponentFixture<CartConventionShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartConventionShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartConventionShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
