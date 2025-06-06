import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDropShipmentComponent } from './cart-drop-shipment.component';

describe('CartDropShipmentComponent', () => {
  let component: CartDropShipmentComponent;
  let fixture: ComponentFixture<CartDropShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartDropShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDropShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
