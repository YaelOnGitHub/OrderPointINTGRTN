import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDtpLimitsComponent } from './my-dtp-limits.component';

describe('MyDtpLimitsComponent', () => {
  let component: MyDtpLimitsComponent;
  let fixture: ComponentFixture<MyDtpLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyDtpLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDtpLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
