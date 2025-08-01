import { IsString, IsNumber, IsArray, IsOptional, Min, Max, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

class TeamDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  players: string[];
}

export class CreateMatchDto {
  @IsDefined()
  @Type(() => TeamDto)
  teamA: TeamDto;

  @IsDefined()
  @Type(() => TeamDto)
  teamB: TeamDto;

  @IsNumber()
  @Min(1)
  @Max(50)
  overs: number;

  @IsOptional()
  @IsString()
  venue?: string;
}
