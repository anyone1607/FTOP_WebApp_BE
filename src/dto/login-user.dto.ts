// import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  // @IsNotEmpty()
  // @IsEmail()
  emailOrPhone: string;

  // @IsNotEmpty()
  password: string;
}
