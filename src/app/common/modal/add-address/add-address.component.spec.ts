import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressComponent } from './add-address.component';

describe('AdAddressComponent', () => {
  let component: AdAddressComponent;
  let fixture: ComponentFixture<AdAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
