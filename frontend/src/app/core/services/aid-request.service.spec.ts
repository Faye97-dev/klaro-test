import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AidRequestService } from './aid-request.service';
import { AidCategory, AidStatus } from '../models/aid-request.model';
import { environment } from '../../../environments/environment';

describe('AidRequestService', () => {
  let service: AidRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AidRequestService],
    });
    service = TestBed.inject(AidRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load beneficiary requests and update BehaviorSubject', () => {
    const beneficiaryId = '8337c1da-cd02-43f6-a653-4cf636a3b610';
    const mockResponse = {
      data: [
        {
          id: '1',
          beneficiaryId,
          category: AidCategory.FOOD,
          amount: '100',
          description: 'Test',
          status: AidStatus.PENDING,
          createdAt: '',
          updatedAt: '',
        },
      ],
      total: 1,
    };

    let emitted: unknown;
    service.requests$.subscribe((v) => (emitted = v));

    service.loadForBeneficiary(beneficiaryId).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/aid-requests?beneficiaryId=${beneficiaryId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(emitted).toEqual(mockResponse.data);
  });
});
