import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingClientsList } from './pending-clients-list';

describe('PendingClientsList', () => {
  let component: PendingClientsList;
  let fixture: ComponentFixture<PendingClientsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingClientsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingClientsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
