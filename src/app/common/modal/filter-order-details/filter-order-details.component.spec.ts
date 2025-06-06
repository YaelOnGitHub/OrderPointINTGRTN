import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOrderDetailsComponent } from './filter-order-details.component';

describe('FilterOrderDetailsComponent', () => {
  let component: FilterOrderDetailsComponent;
  let fixture: ComponentFixture<FilterOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
