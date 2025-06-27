import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLawyersList } from './pending-lawyers-list';

describe('PendingLawyersList', () => {
  let component: PendingLawyersList;
  let fixture: ComponentFixture<PendingLawyersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingLawyersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingLawyersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
