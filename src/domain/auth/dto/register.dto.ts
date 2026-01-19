import { IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role?: UserRole; // ADMIN can choose role
}
