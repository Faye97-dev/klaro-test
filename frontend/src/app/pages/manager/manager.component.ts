import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AidRequestService } from '../../core/services/aid-request.service';
import { AidRequest, AidStatus } from '../../core/models/aid-request.model';
import {
  getCategoryLabel,
  getNextStatuses,
  getStatusLabel,
} from '../../core/helpers/aid-request.helpers';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly getCategoryLabel = getCategoryLabel;
  readonly getStatusLabel = getStatusLabel;
  readonly getNextStatuses = getNextStatuses;

  readonly displayedColumns = [
    'beneficiaryId',
    'category',
    'amount',
    'status',
    'actions',
  ];

  requests$ = this.aidRequestService.requests$;

  selectedStatus: Record<string, AidStatus> = {};

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly aidRequestService: AidRequestService) {}

  ngOnInit(): void {
    this.loading = true;
    this.aidRequestService
      .loadAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => (this.loading = false),
        error: () => (this.loading = false),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateStatus(request: AidRequest): void {
    const status = this.selectedStatus[request.id];
    if (!status) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.aidRequestService
      .updateStatus(request.id, status)
      .pipe(
        switchMap(() => this.aidRequestService.loadAll()),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.successMessage = `Statut mis à jour vers ${getStatusLabel(status)}`;
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message ?? 'Transition de statut invalide';
        },
      });
  }
}
