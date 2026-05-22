import { IsEnum } from 'class-validator';
import { AidStatusEnum } from '../enums/aid-status.enum';

export class UpdateStatusDto {
  @IsEnum(AidStatusEnum)
  status: AidStatusEnum;
}
