import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AidRequestService } from '../../core/services/aid-request.service';
import { AuthService } from '../../core/services/auth.service';
import { AidCategory } from '../../core/models/aid-request.model';
import {
  getCategoryLabel,
  getStatusLabel,
} from '../../core/helpers/aid-request.helpers';

@Component({
  selector: 'app-beneficiary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiaryComponent implements OnInit {
  readonly categories = Object.values(AidCategory);
  readonly getCategoryLabel = getCategoryLabel;
  readonly getStatusLabel = getStatusLabel;
  readonly displayedColumns = [
    'category',
    'amount',
    'description',
    'status',
    'createdAt',
  ];

  form: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;
  submitting = false;

  requests$ = this.aidRequestService.requests$;

  constructor(
    private readonly fb: FormBuilder,
    private readonly aidRequestService: AidRequestService,
    private readonly authService: AuthService,
  ) {
    this.form = this.fb.group({
      category: ['', Validators.required],
      amount: [
        null,
        [Validators.required, Validators.min(0.01), Validators.max(5000)],
      ],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.aidRequestService
      .loadForBeneficiary(this.authService.currentUserId)
      .subscribe({
        next: () => (this.loading = false),
        error: () => (this.loading = false),
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.submitting = true;
    const { category, amount, description } = this.form.getRawValue();

    this.aidRequestService
      .create({
        beneficiaryId: this.authService.currentUserId,
        category,
        amount: Number(amount),
        description,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Demande soumise avec succès !';
          this.form.reset();
          this.aidRequestService
            .loadForBeneficiary(this.authService.currentUserId)
            .subscribe();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message ?? 'Erreur lors de la soumission';
        },
      });
  }
}
