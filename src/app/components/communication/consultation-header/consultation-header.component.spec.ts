import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationHeaderComponent } from './consultation-header.component';

describe('ConsultationHeaderComponent', () => {
  let component: ConsultationHeaderComponent;
  let fixture: ComponentFixture<ConsultationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
