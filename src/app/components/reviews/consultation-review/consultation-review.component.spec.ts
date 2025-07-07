import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationReviewComponent } from './consultation-review.component';

describe('ConsultationReviewComponent', () => {
  let component: ConsultationReviewComponent;
  let fixture: ComponentFixture<ConsultationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
