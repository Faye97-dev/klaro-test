import { AidStatusEnum } from './enums/aid-status.enum';

export const PAGE_SIZE = 10;
export const MAX_ACTIVE_REQUESTS = 2;
export const MAX_REQUEST_AMOUNT = 5000;
export const MAX_DESCRIPTION_LENGTH = 2000;

export const ACTIVE_STATUSES: AidStatusEnum[] = [
  AidStatusEnum.PENDING,
  AidStatusEnum.UNDER_REVIEW,
];

export const ALLOWED_TRANSITIONS: Record<AidStatusEnum, AidStatusEnum[]> = {
  [AidStatusEnum.PENDING]: [AidStatusEnum.UNDER_REVIEW, AidStatusEnum.REJECTED],
  [AidStatusEnum.UNDER_REVIEW]: [
    AidStatusEnum.APPROVED,
    AidStatusEnum.REJECTED,
  ],
  [AidStatusEnum.APPROVED]: [],
  [AidStatusEnum.REJECTED]: [],
};
