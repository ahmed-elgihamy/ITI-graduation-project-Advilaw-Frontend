import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowDetailsComponent } from './escrow-details.component';

describe('EscrowDetailsComponent', () => {
  let component: EscrowDetailsComponent;
  let fixture: ComponentFixture<EscrowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscrowDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscrowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
