import { IsString, IsEmail, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'PIN must be exactly 6 digits' })
  pin?: number;

  @IsString()
  @IsOptional()
  avatar?: string;

}
