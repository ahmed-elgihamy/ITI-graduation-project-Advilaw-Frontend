import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerListComponent } from './lawyer-list.component';

describe('LawyerListComponent', () => {
  let component: LawyerListComponent;
  let fixture: ComponentFixture<LawyerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawyerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
