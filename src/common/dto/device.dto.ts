import { IsString, MaxLength } from 'class-validator';

export class DeviceDto {
  @IsString()
  @MaxLength(150)
  id: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(150)
  staticName: string;

  @IsString()
  @MaxLength(150)
  ward: string;
}