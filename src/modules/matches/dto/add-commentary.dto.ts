import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';

export class AddCommentaryDto {
  @IsNumber()
  @Min(0)
  over: number;

  @IsNumber()
  @Min(0)
  ball: number;

  @IsNumber()
  @Min(0)
  runs: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isSix?: boolean;

  @IsOptional()
  @IsBoolean()
  isFour?: boolean;

  @IsOptional()
  @IsBoolean()
  isWicket?: boolean;
}