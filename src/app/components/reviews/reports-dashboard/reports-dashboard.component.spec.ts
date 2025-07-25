import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDashboardComponent } from './reports-dashboard.component';

describe('ReportsDashboardComponent', () => {
  let component: ReportsDashboardComponent;
  let fixture: ComponentFixture<ReportsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
