import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardWelcome } from './admin-dashboard-welcome';

describe('AdminDashboardWelcome', () => {
  let component: AdminDashboardWelcome;
  let fixture: ComponentFixture<AdminDashboardWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
