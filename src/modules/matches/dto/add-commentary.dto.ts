import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { EventType } from '../../../types/match.types';

export class AddCommentaryDto {
  @IsNumber()
  @Min(0)
  over: number;

  @IsNumber()
  @Min(1)
  ball: number;

  @IsEnum(EventType)
  eventType: EventType;

  @IsNumber()
  @Min(0)
  runs: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  batsman?: string;

  @IsOptional()
  @IsString()
  bowler?: string;

  @IsOptional()
  @IsBoolean()
  isWicket?: boolean;

  @IsOptional()
  @IsString()
  wicketType?: string;
}