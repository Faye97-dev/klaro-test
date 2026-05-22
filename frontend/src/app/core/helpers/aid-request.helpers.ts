import { AidCategory, AidStatus } from '../models/aid-request.model';

const TRANSITIONS: Record<AidStatus, AidStatus[]> = {
  [AidStatus.PENDING]: [AidStatus.UNDER_REVIEW, AidStatus.REJECTED],
  [AidStatus.UNDER_REVIEW]: [AidStatus.APPROVED, AidStatus.REJECTED],
  [AidStatus.APPROVED]: [],
  [AidStatus.REJECTED]: [],
};

export const AID_STATUS_LABELS: Record<AidStatus, string> = {
  [AidStatus.PENDING]: 'En attente',
  [AidStatus.UNDER_REVIEW]: 'En cours',
  [AidStatus.APPROVED]: 'Approuvée',
  [AidStatus.REJECTED]: 'Rejetée',
};

export const AID_CATEGORY_LABELS: Record<AidCategory, string> = {
  [AidCategory.HOUSING]: 'Logement',
  [AidCategory.FOOD]: 'Alimentation',
  [AidCategory.HEALTH]: 'Santé',
  [AidCategory.ENERGY]: 'Énergie',
  [AidCategory.OTHER]: 'Autre',
};

export const getStatusLabel = (status: AidStatus): string =>
  AID_STATUS_LABELS[status] ?? status;

export const getCategoryLabel = (category: AidCategory): string =>
  AID_CATEGORY_LABELS[category] ?? category;

export const getNextStatuses = (current: AidStatus): AidStatus[] => {
  return TRANSITIONS[current] ?? [];
};
