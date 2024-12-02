import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Please enter a valid email address.' })
    email: string;
  
    @IsString()
    @MinLength(3)
    displayName: string;
  
    @IsString()
    password: string;
  
    @IsOptional()
    @IsString()
    phoneNumber?: string;
  
    @IsOptional()
    @IsString()
    avatar?: string;
    
}