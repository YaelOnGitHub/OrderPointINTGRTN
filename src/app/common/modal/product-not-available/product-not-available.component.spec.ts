import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotAvailableComponent } from './product-not-available.component';

describe('ProductNotAvailableComponent', () => {
  let component: ProductNotAvailableComponent;
  let fixture: ComponentFixture<ProductNotAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductNotAvailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
