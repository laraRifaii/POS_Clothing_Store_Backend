import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreInfoDto } from './create.dto';

export class UpdateStoreInfoDto extends PartialType(CreateStoreInfoDto) {}
