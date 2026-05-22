import { AidCategoryEnum } from '../enums/aid-category.enum';
import { AidStatusEnum } from '../enums/aid-status.enum';

export interface AidRequestEntity {
  id: string;
  beneficiaryId: string;
  category: AidCategoryEnum;
  amount: string;
  description: string;
  status: AidStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
