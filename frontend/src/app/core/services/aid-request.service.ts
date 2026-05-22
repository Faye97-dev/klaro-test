import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AidRequest,
  AidRequestsResponse,
  AidStatus,
  CreateAidRequestPayload,
} from '../models/aid-request.model';

@Injectable({ providedIn: 'root' })
export class AidRequestService {
  private readonly apiUrl = `${environment.apiUrl}/aid-requests`;
  private readonly requestsSubject = new BehaviorSubject<AidRequest[]>([]);

  readonly requests$ = this.requestsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadForBeneficiary(beneficiaryId: string): Observable<AidRequestsResponse> {
    const params = new HttpParams().set('beneficiaryId', beneficiaryId);
    return this.http
      .get<AidRequestsResponse>(this.apiUrl, { params })
      .pipe(tap((res) => this.requestsSubject.next(res.data)));
  }

  loadAll(): Observable<AidRequestsResponse> {
    return this.http
      .get<AidRequestsResponse>(this.apiUrl)
      .pipe(tap((res) => this.requestsSubject.next(res.data)));
  }

  create(payload: CreateAidRequestPayload): Observable<AidRequest> {
    return this.http.post<AidRequest>(this.apiUrl, payload).pipe(
      tap((created) => {
        this.requestsSubject.next([
          created,
          ...this.requestsSubject.value,
        ]);
      }),
    );
  }

  updateStatus(id: string, status: AidStatus): Observable<AidRequest> {
    return this.http
      .patch<AidRequest>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        tap((updated) => {
          const next = this.requestsSubject.value.map((r) =>
            r.id === updated.id ? updated : r,
          );
          this.requestsSubject.next(next);
        }),
      );
  }
}
