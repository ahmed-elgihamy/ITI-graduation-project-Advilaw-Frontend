import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileEdit } from './admin-profile-edit';

describe('AdminProfileEdit', () => {
  let component: AdminProfileEdit;
  let fixture: ComponentFixture<AdminProfileEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfileEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfileEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
