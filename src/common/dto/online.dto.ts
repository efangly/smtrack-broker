import { IsString, MaxLength } from 'class-validator';

export class OnlineDto {
  @IsString()
  @MaxLength(150)
  device: string;

  @IsString()
  @MaxLength(150)
  message: string;

  @IsString()
  @MaxLength(150)
  hospital: string;

  @IsString()
  @MaxLength(150)
  time: string;
}