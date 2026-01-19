import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Param, 
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { Permission } from './decorators/permissions.decorator';
import { Permissions } from './permissions/permissions.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // -------------------------
  // PUBLIC ROUTES
  // -------------------------
  
  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  // -------------------------
  // PROTECTED ROUTES (Admin only)
  // -------------------------

  @Post('signup')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permission(Permissions.MANAGE_USERS)
  @Roles(UserRole.ADMIN)
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findById(id);
  }

  @Put('users/:id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permission(Permissions.MANAGE_USERS)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<RegisterDto>
  ) {
    return this.authService.update(id, dto);
  }

  @Put('users/:id/toggle-active')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permission(Permissions.MANAGE_USERS)
  @Roles(UserRole.ADMIN)
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.authService.toggleActive(id);
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permission(Permissions.MANAGE_USERS)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.authService.delete(id);
  }

  @Delete('users/:id/hard')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permission(Permissions.MANAGE_USERS)
  @Roles(UserRole.ADMIN)
  async hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.authService.hardDelete(id);
  }
}