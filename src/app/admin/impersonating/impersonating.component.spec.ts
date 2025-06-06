import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpersonatingComponent } from './impersonating.component';

describe('ImpersonatingComponent', () => {
  let component: ImpersonatingComponent;
  let fixture: ComponentFixture<ImpersonatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpersonatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpersonatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
