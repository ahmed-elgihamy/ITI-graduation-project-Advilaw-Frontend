import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerConsultationComponent } from './lawyer-consultation.component';

describe('LawyerConsultationComponent', () => {
  let component: LawyerConsultationComponent;
  let fixture: ComponentFixture<LawyerConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyerConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawyerConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
