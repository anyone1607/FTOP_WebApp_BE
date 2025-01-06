import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Matches(/^[a-z0-9]+@fpt\.edu\.vn$/, {
    message: 'Email phải có định dạng chunglv@fpt.edu.vn',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự',
  })
  @MaxLength(30, {
    message: 'Mật khẩu không vượt quá 30 ký tự',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10}$/, {
    message: 'Số điện thoại phải gồm 10 chữ số',
  })
  phoneNumber?: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, {
    message: 'Mã PIN phải gồm 6 chữ số',
  })
  pin?: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}
