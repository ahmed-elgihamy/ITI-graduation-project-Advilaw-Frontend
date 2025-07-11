import { TestBed } from '@angular/core/testing';

import { LawyerPaymentsService } from './lawyer-payments.service';

describe('LawyerPaymentsServiceService', () => {
  let service: LawyerPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LawyerPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
