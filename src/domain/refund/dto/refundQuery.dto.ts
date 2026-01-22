import { Type } from "class-transformer";
import { IsOptional, IsInt, IsString, Min } from "class-validator";

export class RefundQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  saleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
