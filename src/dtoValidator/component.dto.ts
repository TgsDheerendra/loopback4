import {IsIn, IsInt, IsOptional, IsPositive, IsString} from 'class-validator';

export class ComponentDTO {
  @IsString()
  mfgPN: string;

  @IsString()
  mfgName: string;

  @IsInt()
  @IsPositive()
  packageQty: number;

  @IsString()
  @IsIn(['Active', 'Inactive', 'Discontinued']) // Valid part status
  partStatus: string;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  detailDescription?: string;
}
