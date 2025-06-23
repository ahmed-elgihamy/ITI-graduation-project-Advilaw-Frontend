import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetConfirmationComponent } from './reset-confirmation.component';

describe('ResetConfirmationComponent', () => {
  let component: ResetConfirmationComponent;
  let fixture: ComponentFixture<ResetConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
