import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLawyerComponent } from './all-lawyer.component';

describe('AllLawyerComponent', () => {
  let component: AllLawyerComponent;
  let fixture: ComponentFixture<AllLawyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLawyerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
