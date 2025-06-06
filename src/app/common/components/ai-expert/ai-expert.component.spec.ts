import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiExpertComponent } from './ai-expert.component';

describe('AiExpertComponent', () => {
  let component: AiExpertComponent;
  let fixture: ComponentFixture<AiExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiExpertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
