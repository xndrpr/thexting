import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Gender } from 'src/db/entities/user.entity';

export class SignUpDto {
  @IsString()
  nickname: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNumber()
  gender: Gender;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
