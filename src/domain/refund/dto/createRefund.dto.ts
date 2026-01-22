
import { IsInt, IsString, IsEnum, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { RefundType } from './shared/refundType.enum';

export class RefundItemDto {
  @IsInt()
  saleItemId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  refundAmount: number;
}

export class CreateRefundDto {
  @IsInt()
  saleId: number;

  @IsEnum(RefundType)
  refundType: RefundType;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefundItemDto)
  items: RefundItemDto[];
}
