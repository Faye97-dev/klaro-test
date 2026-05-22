import { AidCategoryEnum } from './enums/aid-category.enum';
import { AidStatusEnum } from './enums/aid-status.enum';

export interface AidRequestRow {
  id: string;
  beneficiary_id: string;
  category: AidCategoryEnum;
  amount: string;
  description: string;
  status: AidStatusEnum;
  created_at: Date;
  updated_at: Date;
}

export interface CountRow {
  count: string;
}
