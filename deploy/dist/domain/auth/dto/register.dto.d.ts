import { UserRole } from '../enums/user-role.enum';
export declare class RegisterDto {
    username: string;
    password: string;
    role?: UserRole;
}
