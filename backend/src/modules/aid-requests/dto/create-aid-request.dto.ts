import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
} from 'class-validator';
import { AidCategoryEnum } from '../enums/aid-category.enum';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_REQUEST_AMOUNT,
} from '../aid-requests.constants';

export class CreateAidRequestDto {
  @IsUUID()
  beneficiaryId: string;

  @IsEnum(AidCategoryEnum)
  category: AidCategoryEnum;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(MAX_REQUEST_AMOUNT)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_DESCRIPTION_LENGTH)
  description: string;
}
