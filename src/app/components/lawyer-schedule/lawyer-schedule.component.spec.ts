import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerScheduleComponent } from './lawyer-schedule.component';

describe('LawyerScheduleComponent', () => {
  let component: LawyerScheduleComponent;
  let fixture: ComponentFixture<LawyerScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyerScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawyerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
