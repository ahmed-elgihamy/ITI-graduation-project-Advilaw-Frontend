import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerDetailsComponent } from './lawyer-details.component';

describe('LawyerDetailsComponent', () => {
  let component: LawyerDetailsComponent;
  let fixture: ComponentFixture<LawyerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawyerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
