import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'src/db/entities/user.entity';

export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsNumber()
  age: number;

  // @IsDate()
  dateOfBirth: Date;

  @IsNumber()
  gender: Gender;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
