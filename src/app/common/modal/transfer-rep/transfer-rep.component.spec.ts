import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferRepComponent } from './transfer-rep.component';

describe('TransferRepComponent', () => {
  let component: TransferRepComponent;
  let fixture: ComponentFixture<TransferRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferRepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
