import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  readonly username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsOptional()
  @IsNotEmpty()
  readonly bio: string;
}
