import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearCartComponent } from './clear-cart.component';

describe('ClearCartComponent', () => {
  let component: ClearCartComponent;
  let fixture: ComponentFixture<ClearCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
