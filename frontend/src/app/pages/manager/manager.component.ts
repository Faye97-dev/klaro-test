import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
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
export class ManagerComponent implements OnInit {
  readonly getCategoryLabel = getCategoryLabel;
  readonly getStatusLabel = getStatusLabel;
  readonly displayedColumns = [
    'beneficiaryId',
    'category',
    'amount',
    'status',
    'actions',
  ];

  requests$ = this.aidRequestService.requests$;
  selectedStatus: Record<string, AidStatus> = {};
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private readonly aidRequestService: AidRequestService) {}

  ngOnInit(): void {
    this.loading = true;
    this.aidRequestService.loadAll().subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false),
    });
  }

  getNextStatuses(current: AidStatus): AidStatus[] {
    return getNextStatuses(current);
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
      .pipe(switchMap(() => this.aidRequestService.loadAll()))
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
