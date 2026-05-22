import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { AidStatusEnum } from '../enums/aid-status.enum';
import { AidCategoryEnum } from '../enums/aid-category.enum';

export class QueryAidRequestsDto {
  @IsOptional()
  @IsUUID()
  beneficiaryId?: string;

  @IsOptional()
  @IsEnum(AidCategoryEnum)
  category?: AidCategoryEnum;

  @IsOptional()
  @IsEnum(AidStatusEnum)
  status?: AidStatusEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
