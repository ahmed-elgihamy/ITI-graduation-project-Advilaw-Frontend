import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLawyerProfileComponent } from './edit-lawyer-profile.component';

describe('EditLawyerProfileComponent', () => {
  let component: EditLawyerProfileComponent;
  let fixture: ComponentFixture<EditLawyerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLawyerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLawyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
