import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSSOComponent } from './loginsso.component';

describe('LogOutComponent', () => {
  let component: LoginSSOComponent;
  let fixture: ComponentFixture<LoginSSOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSSOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
