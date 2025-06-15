import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsListComponent } from './proposals-list.component';

describe('ProposalsListComponent', () => {
  let component: ProposalsListComponent;
  let fixture: ComponentFixture<ProposalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
